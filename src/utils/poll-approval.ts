import axios from 'axios';

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

export type PollResult = 'approved' | 'rejected' | 'timeout';

export async function pollApproval(sessionId: string): Promise<PollResult> {
    const start = Date.now();

    while (Date.now() - start < POLL_TIMEOUT_MS) {
        try {
            const res = await axios.get('/api/approval', { params: { session_id: sessionId } });
            const status = res.data?.status;

            if (status === 'approved') return 'approved';
            if (status === 'rejected') return 'rejected';
        } catch {
            //
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    return 'timeout';
}
