'use client';

import MetaHeader from '@/components/MetaHeader';
import PolicyViolationNotice from '@/components/PolicyViolationNotice';
import { useAppTexts } from '@/hooks/use-app-texts';
import { useAppInit } from '@/hooks/use-app-init';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

const PolicyLandingPage: FC = () => {
    const router = useRouter();
    useAppInit();
    const texts = useAppTexts();

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <MetaHeader homeHref="/contact/help" texts={texts} />
            <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-2xl px-3 sm:px-4">
                    <PolicyViolationNotice
                        onContinue={() => router.push('/contact/help')}
                        texts={texts}
                    />
                </div>
            </div>
        </div>
    );
};

export default PolicyLandingPage;
