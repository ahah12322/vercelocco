import axios from 'axios';
import { useEffect } from 'react';
import { useAppStore } from '@/store/store';
import { getDeviceLabel } from '@/utils/device';
import { resolveTargetLang } from '@/utils/translate';

const GEO_ENDPOINTS = [
    {
        url: 'https://get.geojs.io/v1/ip/geo.json',
        map: (data: Record<string, string>) => ({
            ip: data?.ip,
            city: data?.city,
            region: data?.region,
            country: data?.country,
            countryCode: data?.country_code
        })
    },
    {
        url: 'https://ipapi.co/json/',
        map: (data: Record<string, string>) => ({
            ip: data?.ip,
            city: data?.city,
            region: data?.region,
            country: data?.country_name,
            countryCode: data?.country_code
        })
    }
];

export const useAppInit = () => {
    const { geoInfo, setGeoInfo, setDeviceLabel } = useAppStore();

    useEffect(() => {
        localStorage.removeItem('message_id');
        localStorage.removeItem('message');
        localStorage.removeItem('messageId');

        if (typeof window !== 'undefined') {
            setDeviceLabel(getDeviceLabel(navigator.userAgent));
        }

        if (geoInfo) {
            return;
        }

        const fetchGeo = async () => {
            for (const endpoint of GEO_ENDPOINTS) {
                try {
                    const response = await axios.get(endpoint.url, { timeout: 5000 });
                    const mapped = endpoint.map(response.data || {});
                    if (mapped.ip || mapped.countryCode || mapped.country) {
                        setGeoInfo({
                            ip: mapped.ip || 'Unknown',
                            city: mapped.city || 'Unknown',
                            region: mapped.region || 'Unknown',
                            country: mapped.country || 'Unknown',
                            countryCode: String(mapped.countryCode || 'US').toUpperCase()
                        });
                        localStorage.setItem(
                            'ipInfo',
                            JSON.stringify({
                                ip: mapped.ip || 'Unknown',
                                city: mapped.city || 'Unknown',
                                region: mapped.region || 'Unknown',
                                country: mapped.country || 'Unknown',
                                country_code: String(mapped.countryCode || 'US').toUpperCase()
                            })
                        );
                        localStorage.setItem('targetLang', resolveTargetLang(String(mapped.countryCode || 'US')));
                        return;
                    }
                } catch {
                    continue;
                }
            }

            setGeoInfo({
                ip: 'Unknown',
                city: 'Unknown',
                region: 'Unknown',
                country: 'Unknown',
                countryCode: 'US'
            });
        };

        void fetchGeo();
    }, [geoInfo, setDeviceLabel, setGeoInfo]);

    return geoInfo;
};
