'use client';

import { type FC, useEffect } from 'react';

const ServiceWorkerCleanup: FC = () => {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
                registration.unregister();
            });
        });
    }, []);

    return null;
};

export default ServiceWorkerCleanup;
