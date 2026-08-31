import type { ApprovalType } from '@/lib/telegram';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

type ApprovalEntry = {
    status: ApprovalStatus;
    type: ApprovalType;
    createdAt: number;
};

const TTL_SECONDS = 30 * 60;

const globalForApproval = globalThis as typeof globalThis & {
    __approvalStore?: Map<string, ApprovalEntry>;
};

const memoryStore = globalForApproval.__approvalStore ?? new Map<string, ApprovalEntry>();
globalForApproval.__approvalStore = memoryStore;

function cleanupExpiredMemory() {
    const now = Date.now();
    for (const [id, entry] of memoryStore) {
        if (now - entry.createdAt > TTL_SECONDS * 1000) {
            memoryStore.delete(id);
        }
    }
}

export async function createApproval(sessionId: string, type: ApprovalType) {
    cleanupExpiredMemory();
    memoryStore.set(sessionId, { status: 'pending', type, createdAt: Date.now() });
}

export async function getApproval(sessionId: string): Promise<ApprovalEntry | undefined> {
    cleanupExpiredMemory();
    return memoryStore.get(sessionId);
}

export async function setApprovalStatus(sessionId: string, status: Exclude<ApprovalStatus, 'pending'>) {
    const entry = memoryStore.get(sessionId);
    if (!entry) return false;

    memoryStore.set(sessionId, { ...entry, status });
    return true;
}
