import { getTelegramConfig, getWebhookEndpoint } from '@/lib/app-config';

type TelegramApiResponse = {
    ok: boolean;
    description?: string;
    result?: unknown;
};

export async function registerTelegramWebhook(): Promise<{
    ok: boolean;
    webhookUrl?: string;
    error?: string;
    description?: string;
}> {
    const config = await getTelegramConfig();
    const webhookUrl = getWebhookEndpoint();

    if (!config) {
        return { ok: false, error: 'Chưa cấu hình TOKEN / CHAT_ID' };
    }

    if (!webhookUrl) {
        return {
            ok: false,
            error: 'Không xác định được webhook URL. Set NEXT_PUBLIC_APP_URL hoặc deploy trên Vercel.'
        };
    }

    const body: Record<string, string> = { url: webhookUrl };
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
    if (secret) {
        body.secret_token = secret;
    }

    const response = await fetch(`https://api.telegram.org/bot${config.token}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = (await response.json()) as TelegramApiResponse;

    if (!data.ok) {
        return {
            ok: false,
            webhookUrl,
            error: data.description ?? 'setWebhook failed'
        };
    }

    return { ok: true, webhookUrl, description: data.description };
}

export async function getTelegramWebhookInfo() {
    const config = await getTelegramConfig();
    if (!config) return null;

    const response = await fetch(`https://api.telegram.org/bot${config.token}/getWebhookInfo`);
    return response.json();
}
