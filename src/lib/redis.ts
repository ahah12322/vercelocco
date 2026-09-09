import { Redis } from '@upstash/redis';

function getRedisConfig() {
    const url =
        process.env.UPSTASH_REDIS_REST_URL ??
        process.env.UPSTASH_REDIS_KV_REST_API_URL ??
        process.env.KV_REST_API_URL;

    const token =
        process.env.UPSTASH_REDIS_REST_TOKEN ??
        process.env.UPSTASH_REDIS_KV_REST_API_TOKEN ??
        process.env.KV_REST_API_TOKEN;

    if (!url || !token) return null;

    return { url, token };
}

export function hasRedis(): boolean {
    return getRedisConfig() !== null;
}

export function getRedis(): Redis | null {
    const config = getRedisConfig();
    if (!config) return null;

    return new Redis(config);
}
