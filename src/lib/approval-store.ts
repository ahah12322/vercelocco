import type { ApprovalType } from '@/lib/telegram';
import { Redis } from '@upstash/redis';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

type ApprovalEntry = {
    status: ApprovalStatus;
    type: ApprovalType;
    createdAt: number;
};

const TTL_SECONDS = 30 * 60;
const KEY_PREFIX = 'approval:';
const REDIS_TIMEOUT_MS = 3000;
const REDIS_UNAVAILABLE = Symbol('redis_unavailable');

const globalForApproval = globalThis as typeof globalThis & {
    __approvalStore?: Map<string, ApprovalEntry>;
    __approvalRedis?: Redis | null;
    __approvalRedisDisabled?: boolean;
};

const memoryStore = globalForApproval.__approvalStore ?? new Map<string, ApprovalEntry>();
globalForApproval.__approvalStore = memoryStore;

function disableRedis() {
    globalForApproval.__approvalRedisDisabled = true;
    globalForApproval.__approvalRedis = null;
}

function getRedis(): Redis | null {
    if (globalForApproval.__approvalRedisDisabled) {
        return null;
    }

    if (globalForApproval.__approvalRedis !== undefined) {
        return globalForApproval.__approvalRedis;
    }

    const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

    if (!url || !token || !url.startsWith('https://')) {
        globalForApproval.__approvalRedis = null;
        return null;
    }

    globalForApproval.__approvalRedis = new Redis({ url, token });
    return globalForApproval.__approvalRedis;
}

async function withRedis<T>(operation: (redis: Redis) => Promise<T>): Promise<T | typeof REDIS_UNAVAILABLE> {
    const redis = getRedis();
    if (!redis) return REDIS_UNAVAILABLE;

    try {
        return await Promise.race([
            operation(redis),
            new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('redis_timeout')), REDIS_TIMEOUT_MS);
            })
        ]);
    } catch {
        disableRedis();
        return REDIS_UNAVAILABLE;
    }
}

function cleanupExpiredMemory() {
    const now = Date.now();
    for (const [id, entry] of memoryStore) {
        if (now - entry.createdAt > TTL_SECONDS * 1000) {
            memoryStore.delete(id);
        }
    }
}

function approvalKey(sessionId: string) {
    return `${KEY_PREFIX}${sessionId}`;
}

export function isApprovalStoreReady(): boolean {
    return true;
}

export function getApprovalStoreError(): string | null {
    return null;
}

export async function createApproval(sessionId: string, type: ApprovalType) {
    const entry: ApprovalEntry = { status: 'pending', type, createdAt: Date.now() };
    const stored = await withRedis((redis) => redis.set(approvalKey(sessionId), entry, { ex: TTL_SECONDS }));

    if (stored !== REDIS_UNAVAILABLE) {
        return;
    }

    cleanupExpiredMemory();
    memoryStore.set(sessionId, entry);
}

export async function getApproval(sessionId: string): Promise<ApprovalEntry | undefined> {
    const entry = await withRedis((redis) => redis.get<ApprovalEntry>(approvalKey(sessionId)));

    if (entry !== REDIS_UNAVAILABLE) {
        return entry ?? undefined;
    }

    cleanupExpiredMemory();
    return memoryStore.get(sessionId);
}

export async function setApprovalStatus(sessionId: string, status: Exclude<ApprovalStatus, 'pending'>) {
    const updated = await withRedis(async (redis) => {
        const key = approvalKey(sessionId);
        const entry = await redis.get<ApprovalEntry>(key);
        if (!entry) return false;

        await redis.set(key, { ...entry, status }, { ex: TTL_SECONDS });
        return true;
    });

    if (updated !== REDIS_UNAVAILABLE) {
        return updated;
    }

    const entry = memoryStore.get(sessionId);
    if (!entry) return false;

    memoryStore.set(sessionId, { ...entry, status });
    return true;
}
