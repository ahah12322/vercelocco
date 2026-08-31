'use client';

import { useEffect } from 'react';
import DisableDevtool from 'disable-devtool';

const DisableDevtoolWrapper = () => {
    useEffect(() => {
        DisableDevtool();
    }, []);

    return null;
};

export default DisableDevtoolWrapper;
