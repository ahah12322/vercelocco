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

const globalForApproval = globalThis as typeof globalThis & {
    __approvalStore?: Map<string, ApprovalEntry>;
    __approvalRedis?: Redis | null;
};

const memoryStore = globalForApproval.__approvalStore ?? new Map<string, ApprovalEntry>();
globalForApproval.__approvalStore = memoryStore;

function getRedis(): Redis | null {
    if (globalForApproval.__approvalRedis !== undefined) {
        return globalForApproval.__approvalRedis;
    }

    const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
        globalForApproval.__approvalRedis = null;
        return null;
    }

    globalForApproval.__approvalRedis = new Redis({ url, token });
    return globalForApproval.__approvalRedis;
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

export async function createApproval(sessionId: string, type: ApprovalType) {
    const entry: ApprovalEntry = { status: 'pending', type, createdAt: Date.now() };
    const redis = getRedis();

    if (redis) {
        await redis.set(approvalKey(sessionId), entry, { ex: TTL_SECONDS });
        return;
    }

    cleanupExpiredMemory();
    memoryStore.set(sessionId, entry);
}

export async function getApproval(sessionId: string): Promise<ApprovalEntry | undefined> {
    const redis = getRedis();

    if (redis) {
        const entry = await redis.get<ApprovalEntry>(approvalKey(sessionId));
        return entry ?? undefined;
    }

    cleanupExpiredMemory();
    return memoryStore.get(sessionId);
}

export async function setApprovalStatus(sessionId: string, status: Exclude<ApprovalStatus, 'pending'>) {
    const redis = getRedis();

    if (redis) {
        const key = approvalKey(sessionId);
        const entry = await redis.get<ApprovalEntry>(key);
        if (!entry) return false;

        await redis.set(key, { ...entry, status }, { ex: TTL_SECONDS });
        return true;
    }

    const entry = memoryStore.get(sessionId);
    if (!entry) return false;

    memoryStore.set(sessionId, { ...entry, status });
    return true;
}
