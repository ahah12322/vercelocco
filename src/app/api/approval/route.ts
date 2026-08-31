import { getApproval } from '@/lib/approval-store';
import { NextRequest, NextResponse } from 'next/server';

const GET = async (req: NextRequest) => {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ status: 'not_found' }, { status: 400 });
    }

    const entry = await getApproval(sessionId);

    if (!entry) {
        return NextResponse.json({ status: 'not_found' });
    }

    return NextResponse.json({ status: entry.status, type: entry.type });
};

export { GET };
