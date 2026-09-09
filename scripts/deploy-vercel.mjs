import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_LOCAL = join(ROOT, '.env.local');
const REQUIRED = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'];

function readEnvFile(path) {
    if (!existsSync(path)) return {};

    const entries = {};
    for (const line of readFileSync(path, 'utf8').split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        entries[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
    }
    return entries;
}

function run(command, { input } = {}) {
    const result = spawnSync(command, {
        cwd: ROOT,
        encoding: 'utf8',
        shell: true,
        input,
        stdio: input ? ['pipe', 'pipe', 'pipe'] : ['inherit', 'pipe', 'pipe']
    });

    if (result.status !== 0) {
        throw new Error((result.stderr || result.stdout || '').trim() || `Failed: ${command}`);
    }

    return (result.stdout || '').trim();
}

function pushEnv(name, value) {
    for (const target of ['production', 'preview', 'development']) {
        run(`npx vercel env add ${name} ${target} --force`, { input: value });
    }
    console.log(`  + ${name}`);
}

async function setTelegramWebhook(token, siteUrl) {
    const webhookUrl = `${siteUrl.replace(/\/$/, '')}/api/telegram/webhook`;
    const apiUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.ok) {
        throw new Error(data.description || 'setWebhook failed');
    }

    console.log(`\nWebhook Telegram: ${webhookUrl}`);
}

async function main() {
    console.log('=== Deploy production len Vercel ===\n');

    if (!existsSync(join(ROOT, '.vercel', 'project.json'))) {
        console.log('Chua link Vercel project. Chay truoc:');
        console.log('  npx vercel login');
        console.log('  npx vercel link\n');
        process.exit(1);
    }

    const env = readEnvFile(ENV_LOCAL);
    const missing = REQUIRED.filter((key) => !env[key]);

    if (missing.length) {
        console.log(`Thieu trong .env.local: ${missing.join(', ')}`);
        process.exit(1);
    }

    console.log('Dang day env len Vercel...');
    for (const key of REQUIRED) {
        pushEnv(key, env[key]);
    }

    console.log('\nDang deploy production...');
    const output = run('npx vercel --prod --yes');
    const siteUrl = output.match(/https:\/\/[^\s"',\]]+/)?.[0];

    if (!siteUrl) {
        console.log(output);
        console.log('\nDeploy xong nhung khong tim thay URL. Tu set webhook sau.');
        return;
    }

    console.log(`\nSite: ${siteUrl}`);
    await setTelegramWebhook(env.TELEGRAM_BOT_TOKEN, siteUrl);
    console.log('\nXong! Mo site va test form + duyet tay tren Telegram.');
}

main().catch((error) => {
    console.error('\nLoi:', error.message);
    process.exit(1);
});
