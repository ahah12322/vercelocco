'use client';

import LogoMeta from '@/assets/images/logo-meta.svg';
import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';

/** Thanh header Meta (logo), style đồng bộ với trang chính. */
export default function MetaHeader({ homeHref, texts }) {
    const logo = <Image src={LogoMeta} width={64} height={22} alt={texts?.altMeta || 'Meta'} className="h-[22px] w-auto" />;

    return (
        <header
            className="flex h-[52px] w-full shrink-0 items-center justify-center border-b border-[#E0E0E0] bg-white"
            role="banner"
        >
            <div className="flex w-full max-w-[1280px] items-center justify-between px-4">
                {homeHref ? <Link href={homeHref}>{logo}</Link> : logo}
            </div>
        </header>
    );
}

MetaHeader.propTypes = {
    homeHref: PropTypes.string,
    texts: PropTypes.object
};
