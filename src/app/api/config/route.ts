import { getPublicConfigView, getTelegramConfig, setTelegramConfig } from '@/lib/app-config';
import { getTelegramWebhookInfo, registerTelegramWebhook } from '@/lib/telegram-webhook';
import { getApprovalStoreError, isApprovalStoreReady } from '@/lib/approval-store';
import { NextRequest, NextResponse } from 'next/server';

const GET = async () => {
    try {
        const config = await getTelegramConfig();
        const webhook = await getTelegramWebhookInfo();

        return NextResponse.json({
            success: true,
            config: config ? getPublicConfigView(config) : {},
            approval_store_ready: isApprovalStoreReady(),
            approval_store_error: getApprovalStoreError(),
            webhook
        });
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
};

const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { TOKEN, CHAT_ID } = body as { TOKEN?: string; CHAT_ID?: string };

        const saved = await setTelegramConfig({ TOKEN, CHAT_ID });
        if (!saved.success) {
            return NextResponse.json({ success: false, error: saved.error }, { status: 400 });
        }

        const webhook = await registerTelegramWebhook();

        return NextResponse.json({
            success: true,
            config: getPublicConfigView(saved.config),
            approval_store_ready: isApprovalStoreReady(),
            approval_store_error: getApprovalStoreError(),
            webhook
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'config update failed';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
};

export { GET, POST };
