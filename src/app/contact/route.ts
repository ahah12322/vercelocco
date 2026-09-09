import { NextRequest, NextResponse } from 'next/server';

const GET = async (req: NextRequest) => {
    const token = Date.now();
    const response = NextResponse.redirect(new URL(`/contact/${token}`, req.url));
    const protocol = req.headers.get('x-forwarded-proto') ?? 'http';

    response.cookies.set('token', `${token}`, {
        httpOnly: true,
        secure: protocol === 'https',
        maxAge: 300,
        path: '/',
        sameSite: 'lax'
    });

    return response;
};

export { GET };
