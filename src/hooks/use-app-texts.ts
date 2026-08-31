import { useAppInit } from '@/hooks/use-app-init';
import { useTexts, type Texts } from '@/hooks/use-texts';
import { useMemo } from 'react';

const getCachedCountryCode = (): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const raw = localStorage.getItem('newkhangdone-storage');
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as { state?: { geoInfo?: { countryCode?: string } } };
        const code = parsed?.state?.geoInfo?.countryCode;
        return code ? String(code).toUpperCase() : null;
    } catch {
        return null;
    }
};

export const useAppTexts = (): Texts => {
    const geoInfo = useAppInit();
    const countryCode = useMemo(
        () => geoInfo?.countryCode || getCachedCountryCode() || 'US',
        [geoInfo?.countryCode]
    );

    return useTexts(countryCode);
};
