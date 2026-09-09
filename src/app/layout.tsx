'use client';

import DisableDevtool from '@/components/disable-devtool';
import { Analytics } from '@vercel/analytics/react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '@/assets/css/index.css';
import '@/assets/css/style.css';
import '@/assets/css/bootstrap.min.css';
config.autoAddCss = false;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' data-scroll-behavior='smooth'>
            <body className='antialiased'>
                <DisableDevtool />
                {children}
                <Analytics />
            </body>
        </html>
    );
}
