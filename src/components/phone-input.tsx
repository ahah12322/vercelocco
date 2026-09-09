'use client';

import { store } from '@/store/store';
import IntlTelInput from 'intl-tel-input/reactWithUtils';
import 'intl-tel-input/styles';
import { type FC, memo, useMemo } from 'react';

interface PhoneInputProps {
    id?: string;
    name?: string;
    onChange: (value: string) => void;
    error?: boolean;
}

const PhoneInput: FC<PhoneInputProps> = ({ id, name, onChange, error }) => {
    const geoInfo = store((state) => state.geoInfo);
    const countryCode = geoInfo?.country_code?.toLowerCase() || 'us';

    const initOptions = useMemo(
        () => ({
            initialCountry: countryCode as '',
            separateDialCode: true,
            strictMode: true,
            nationalMode: true,
            autoPlaceholder: 'aggressive' as const,
            placeholderNumberType: 'MOBILE' as const,
            countrySearch: false
        }),
        [countryCode]
    );

    return (
        <IntlTelInput
            onChangeNumber={onChange}
            initOptions={initOptions}
            inputProps={{
                id,
                name,
                className: `form-control ${error ? 'is-invalid' : ''}`
            }}
        />
    );
};

export default memo(PhoneInput);
