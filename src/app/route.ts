import { ROOT_REDIRECT_URL } from '@/utils/root-redirect';
import { NextResponse } from 'next/server';

const GET = async () => {
    return NextResponse.redirect(ROOT_REDIRECT_URL);
};

export { GET };
