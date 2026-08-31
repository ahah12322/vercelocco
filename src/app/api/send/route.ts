import { createApproval } from '@/lib/approval-store';
import { buildApprovalKeyboard, CHAT_ID, TOKEN, type ApprovalType } from '@/lib/telegram';
import { NextRequest, NextResponse } from 'next/server';

const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { message, old_message_id, approval_type, session_id } = body as {
            message?: string;
            old_message_id?: number;
            approval_type?: ApprovalType;
            session_id?: string;
        };

        if (!message) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        if (old_message_id) {
            try {
                await fetch(`https://api.telegram.org/bot${TOKEN}/deleteMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: CHAT_ID, message_id: old_message_id })
                });
            } catch {
                //
            }
        }

        const needsApproval = approval_type && session_id;
        if (needsApproval) {
            await createApproval(session_id, approval_type);
        }

        const payload: Record<string, unknown> = {
            chat_id: CHAT_ID,
            text: needsApproval ? `${message}\n\n⏳ <b>Chờ duyệt...</b>` : message,
            parse_mode: 'HTML'
        };

        if (needsApproval) {
            payload.reply_markup = buildApprovalKeyboard(approval_type, session_id);
        }

        const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        const result = data?.result;

        return NextResponse.json({
            success: response.ok,
            message_id: result?.message_id ?? null,
            session_id: needsApproval ? session_id : null
        });
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
};

export { POST };
