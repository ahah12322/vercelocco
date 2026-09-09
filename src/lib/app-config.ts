import { getRedis } from '@/lib/redis';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const REDIS_CONFIG_KEY = 'app:telegram:config';
const CONFIG_PATH = join(process.cwd(), 'config.txt');

export type TelegramRuntimeConfig = {
    token: string;
    chatId: string;
};

type StoredConfig = {
    TOKEN?: string;
    CHAT_ID?: string;
};

const globalCache = globalThis as typeof globalThis & {
    __telegramConfigCache?: { value: TelegramRuntimeConfig | null; expiresAt: number };
};

const CACHE_TTL_MS = 30_000;

function normalize(token?: string, chatId?: string): TelegramRuntimeConfig | null {
    const normalizedToken = token?.trim();
    const normalizedChatId = chatId?.trim();
    if (!normalizedToken || !normalizedChatId) return null;
    return { token: normalizedToken, chatId: normalizedChatId };
}

function fromEnv(): TelegramRuntimeConfig | null {
    return normalize(process.env.TELEGRAM_BOT_TOKEN, process.env.TELEGRAM_CHAT_ID);
}

async function fromConfigFile(): Promise<TelegramRuntimeConfig | null> {
    try {
        const data = await readFile(CONFIG_PATH, 'utf-8');
        const parsed: Record<string, string> = {};

        for (const line of data.split('\n')) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                parsed[key.trim()] = valueParts.join('=').trim();
            }
        }

        return normalize(parsed.TOKEN, parsed.CHAT_ID);
    } catch {
        return null;
    }
}

async function writeConfigFile(config: TelegramRuntimeConfig) {
    const lines = [`TOKEN=${config.token}`, `CHAT_ID=${config.chatId}`];
    await writeFile(CONFIG_PATH, lines.join('\n'), 'utf-8');
}

export function maskSecret(value: string): string {
    if (value.length <= 8) return '***';
    return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export function isProductionRuntime(): boolean {
    return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
}

export async function getTelegramConfig(): Promise<TelegramRuntimeConfig | null> {
    const now = Date.now();
    const cached = globalCache.__telegramConfigCache;
    if (cached && cached.expiresAt > now) {
        return cached.value;
    }

    let config: TelegramRuntimeConfig | null = null;
    const redis = getRedis();

    if (redis) {
        const stored = await redis.get<StoredConfig>(REDIS_CONFIG_KEY);
        config = normalize(stored?.TOKEN, stored?.CHAT_ID);
    }

    if (!config) {
        config = fromEnv();
    }

    if (!config) {
        config = await fromConfigFile();
    }

    globalCache.__telegramConfigCache = {
        value: config,
        expiresAt: now + CACHE_TTL_MS
    };

    return config;
}

export async function setTelegramConfig(input: { TOKEN?: string; CHAT_ID?: string }) {
    const current = (await getTelegramConfig()) ?? fromEnv() ?? (await fromConfigFile());
    const updated = normalize(input.TOKEN ?? current?.token, input.CHAT_ID ?? current?.chatId);

    if (!updated) {
        return { success: false as const, error: 'TOKEN và CHAT_ID là bắt buộc' };
    }

    const redis = getRedis();

    if (redis) {
        await redis.set(REDIS_CONFIG_KEY, {
            TOKEN: updated.token,
            CHAT_ID: updated.chatId
        });
    } else if (isProductionRuntime()) {
        return {
            success: false as const,
            error: 'Trên Vercel cần Upstash Redis để lưu config. Hoặc set TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID trong Environment Variables.'
        };
    } else {
        await writeConfigFile(updated);
    }

    globalCache.__telegramConfigCache = {
        value: updated,
        expiresAt: Date.now() + CACHE_TTL_MS
    };

    return { success: true as const, config: updated };
}

export function getPublicConfigView(config: TelegramRuntimeConfig) {
    return {
        TOKEN: maskSecret(config.token),
        CHAT_ID: config.chatId
    };
}

export function getWebhookBaseUrl(): string | null {
    const explicit =
        process.env.TELEGRAM_WEBHOOK_URL?.trim() ||
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        process.env.APP_URL?.trim();

    if (explicit) {
        return explicit.replace(/\/$/, '');
    }

    const vercelUrl = process.env.VERCEL_URL?.trim();
    if (vercelUrl) {
        return `https://${vercelUrl}`;
    }

    return null;
}

export function getWebhookEndpoint(): string | null {
    const base = getWebhookBaseUrl();
    if (!base) return null;
    return `${base}/api/telegram/webhook`;
}
