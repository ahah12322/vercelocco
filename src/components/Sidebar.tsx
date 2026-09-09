'use client';

import { ArrowIcon, MetaLogoSvg } from '@/components/icons';
import { useMemo, useState, type FC } from 'react';

interface SidebarProps {
    texts: Record<string, string>;
    onOpenSearchModal?: () => void;
    onOpenPrivacyModal?: (question: string) => void;
    onOpenTermsModal?: () => void;
}

const Sidebar: FC<SidebarProps> = ({ texts, onOpenSearchModal, onOpenPrivacyModal, onOpenTermsModal }) => {
    const privacyQuestions = useMemo(
        () => [
            texts.privacyQ1 || 'What is the Privacy Policy and what does it cover?',
            texts.privacyQ2 || 'What information do we collect?',
            texts.privacyQ3 || 'How do we use your information?',
            texts.privacyQ4 || 'How do we share your information on Meta Products or with integrated partners?',
            texts.privacyQ5 || 'How do we share information with third parties?',
            texts.privacyQ6 || 'How is the cooperation between Meta Companies organized?',
            texts.privacyQ7 || 'How can you manage or delete your information and exercise your rights?',
            texts.privacyQ8 || 'How long do we keep your information?',
            texts.privacyQ9 || 'How do we transmit information?',
            texts.privacyQ10 || 'How do we respond to official requests, comply with applicable laws, and prevent harm?',
            texts.privacyQ11 || 'How will you know when the policy changes?',
            texts.privacyQ12 || 'How to ask Meta questions?',
            texts.privacyQ13 || 'Why and how we process your data'
        ],
        [texts]
    );

    const [activePolicy, setActivePolicy] = useState(false);
    const [activeRules, setActiveRules] = useState(false);
    const [activeSettings, setActiveSettings] = useState(false);

    return (
        <div id='left'>
            <div id='logo'>
                <MetaLogoSvg id='sidebarGrad' />
            </div>
            <h1>{texts.metaVerified || 'Meta Verified'}</h1>
            <div id='action-buttons'>
                <div className='action-button main collapsed'>
                    <div className='action-button-img'>
                        <svg aria-hidden='true' fill='currentColor' height='1em' viewBox='0 0 24 24' width='1em'>
                            <path
                                clipRule='evenodd'
                                d='m19.007 9.997-6.338-5.704a1 1 0 0 0-1.338 0L4.993 9.997A3 3 0 0 0 4 12.227v6.61c0 .216.07.38.149.48a.432.432 0 0 0 .284.167c.86.14 2.04.29 3.567.391V16a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v3.875a37.895 37.895 0 0 0 3.567-.39.432.432 0 0 0 .284-.168.773.773 0 0 0 .149-.48v-6.61a3 3 0 0 0-.993-2.23zM3.655 8.51l6.338-5.704a3 3 0 0 1 4.014 0l6.338 5.704A5 5 0 0 1 22 12.227v6.61c0 1.292-.836 2.413-2.11 2.621-.94.153-2.208.312-3.833.418-1.125.073-2.057-.836-2.057-1.964V16a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.912c0 1.128-.932 2.037-2.057 1.964a40.092 40.092 0 0 1-3.832-.418C2.836 21.25 2 20.13 2 18.838v-6.611A5 5 0 0 1 3.655 8.51z'
                                fillRule='evenodd'
                            />
                        </svg>
                    </div>
                    <div className='action-button-text'>{texts.metaVerified || 'Meta Verified'}</div>
                    <div className='action-button-arrow' />
                </div>
                <div className='action-button collapsed' id='search' onClick={onOpenSearchModal}>
                    <div className='action-button-img'>
                        <svg aria-hidden='true' fill='currentColor' height='1em' viewBox='0 0 24 24' width='1em'>
                            <path clipRule='evenodd' d='M16.618 18.032a9 9 0 1 1 1.414-1.414l3.675 3.675a1 1 0 0 1-1.414 1.414l-3.675-3.675zM18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0z' fillRule='evenodd' />
                        </svg>
                    </div>
                    <div className='action-button-text'>{texts.search || 'Search'}</div>
                </div>
                <div aria-controls='PolicyCollapse' aria-expanded={activePolicy} className='action-button collapsed' onClick={() => setActivePolicy(!activePolicy)} id='Policy'>
                    <div className='action-button-img'>
                        <svg aria-hidden='true' fill='currentColor' height='1em' viewBox='0 0 24 24' width='1em'>
                            <path d='M12 12a2 2 0 0 1 1 3.732V17a1 1 0 1 1-2 0v-1.268A2 2 0 0 1 12 12z' />
                            <path
                                clipRule='evenodd'
                                d='M7 6a5 5 0 0 1 10 0v2h.857c1.282 0 2.417.818 2.664 2.076A25.71 25.71 0 0 1 21 15a25.71 25.71 0 0 1-.479 4.924C20.274 21.182 19.14 22 17.857 22H6.143c-1.282 0-2.417-.818-2.664-2.076A25.711 25.711 0 0 1 3 15c0-1.984.236-3.692.479-4.924C3.726 8.818 4.86 8 6.143 8H7V6zm8 0v2H9V6a3 3 0 1 1 6 0zm-8.857 4h11.714a.84.84 0 0 1 .508.157c.107.082.17.182.194.305.223 1.133.441 2.71.441 4.538 0 1.828-.218 3.405-.441 4.538a.488.488 0 0 1-.194.305.84.84 0 0 1-.508.157H6.143a.84.84 0 0 1-.508-.157.489.489 0 0 1-.194-.305A23.712 23.712 0 0 1 5 15c0-1.828.218-3.405.441-4.538a.489.489 0 0 1 .194-.305.84.84 0 0 1 .508-.157z'
                                fillRule='evenodd'
                            />
                        </svg>
                    </div>
                    <div className='action-button-text'>{texts.privacyPolicy || 'Privacy Policy'}</div>
                    <div className='action-button-arrow'>
                        <svg aria-hidden='true' className='ARROW' fill='currentColor' height='1em' viewBox='0 0 24 24' width='1em' style={{ transform: activePolicy ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            <path clipRule='evenodd' d='M4.341 7.247a1 1 0 0 1 1.412.095L12 14.482l6.247-7.14a1 1 0 0 1 1.506 1.317l-7 8a1 1 0 0 1-1.506 0l-7-8a1 1 0 0 1 .095-1.412z' fillRule='evenodd' />
                        </svg>
                    </div>
                </div>
                <div className={`collapse ${activePolicy ? 'show' : ''}`} id='PolicyCollapse'>
                    <div className='action-button-list' style={{ paddingLeft: '20px' }}>
                        {privacyQuestions.map((question, index) => (
                            <div key={index} className='action-button wide' onClick={() => onOpenPrivacyModal?.(question)} style={{ cursor: 'pointer' }}>
                                <div className='action-button-text'>
                                    <span>{question}</span>
                                </div>
                                <div className='action-button-arrow'>
                                    <ArrowIcon />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div aria-controls='RulesCollapse' aria-expanded={activeRules} className='action-button collapsed' onClick={() => setActiveRules(!activeRules)}>
                    <div className='action-button-img'>
                        <svg aria-hidden='true' fill='currentColor' height='1em' viewBox='0 0 24 24' width='1em'>
                            <path
                                clipRule='evenodd'
                                d='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 2c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zm0-13.702c.483 0 .875.391.875.875V17a.875.875 0 0 1-1.75 0v-6.827c0-.484.392-.875.875-.875zm0-1.275c.833 0 1.25-.405 1.25-1.012C13.25 6.405 12.833 6 12 6s-1.25.405-1.25 1.011c0 .607.417 1.012 1.25 1.012z'
                                fillRule='evenodd'
                            />
                        </svg>
                    </div>
                    <div className='action-button-text'>{texts.otherRules || 'Other rules and articles'}</div>
                    <div className='action-button-arrow'>
                        <svg aria-hidden='true' className='ARROW' fill='currentColor' height='1em' viewBox='0 0 24 24' width='1em' style={{ transform: activeRules ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            <path clipRule='evenodd' d='M4.341 7.247a1 1 0 0 1 1.412.095L12 14.482l6.247-7.14a1 1 0 0 1 1.506 1.317l-7 8a1 1 0 0 1-1.506 0l-7-8a1 1 0 0 1 .095-1.412z' fillRule='evenodd' />
                        </svg>
                    </div>
                </div>
                <div className={`collapse ${activeRules ? 'show' : ''}`} id='RulesCollapse'>
                    <div className='action-button-list' style={{ paddingLeft: '20px' }}>
                        <div className='action-button wide' onClick={onOpenTermsModal} style={{ cursor: 'pointer' }}>
                            <div className='action-button-text'>
                                <span>{texts.termsOfUse || 'Terms of use'}</span>
                            </div>
                            <div className='action-button-arrow'>
                                <ArrowIcon />
                            </div>
                        </div>
                    </div>
                </div>
                <div aria-controls='SettingCollapse' aria-expanded={activeSettings} className='action-button collapsed' onClick={() => setActiveSettings(!activeSettings)}>
                    <div className='action-button-img'>
                        <svg aria-hidden='true' fill='currentColor' height='1em' viewBox='0 0 24 24' width='1em'>
                            <path clipRule='evenodd' d='M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-2 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z' fillRule='evenodd' />
                            <path
                                clipRule='evenodd'
                                d='m22.191 9.207-2.224 2.06a8.112 8.112 0 0 1 0 1.466l2.224 2.06a1 1 0 0 1 .187 1.233l-1.702 2.948a1 1 0 0 1-1.162.455l-2.895-.896a7.991 7.991 0 0 1-1.27.735l-.672 2.954a1 1 0 0 1-.975.778H10.3a1 1 0 0 1-.975-.778l-.672-2.954a8 8 0 0 1-1.27-.735l-2.895.896a1 1 0 0 1-1.162-.455l-1.702-2.948a1 1 0 0 1 .187-1.233l2.224-2.06a8.1 8.1 0 0 1 0-1.466L1.81 9.207a1 1 0 0 1-.187-1.233l1.702-2.948a1 1 0 0 1 1.162-.455l2.895.896a7.992 7.992 0 0 1 1.27-.735l.672-2.954A1 1 0 0 1 10.299 1h3.403a1 1 0 0 1 .975.778l.672 2.954a7.99 7.99 0 0 1 1.27.735l2.895-.896a1 1 0 0 1 1.162.455l1.702 2.948a1 1 0 0 1-.187 1.233zm-8.574-3.071.894.412c.335.155.653.34.952.551l.805.57 3.075-.951.903 1.564-2.36 2.186.09.98a6.093 6.093 0 0 1 0 1.104l-.09.98 2.36 2.185-.903 1.565-3.075-.951-.805.57a5.993 5.993 0 0 1-.952.55l-.894.413L12.904 21h-1.807l-.713-3.136-.894-.412a5.993 5.993 0 0 1-.952-.551l-.805-.57-3.075.951-.904-1.565 2.36-2.185-.089-.98a6.102 6.102 0 0 1 0-1.104l.09-.98-2.36-2.186.903-1.564 3.075.951.805-.57c.299-.212.617-.396.952-.55l.894-.413L11.097 3h1.807l.713 3.136z'
                                fillRule='evenodd'
                            />
                        </svg>
                    </div>
                    <div className='action-button-text'>{texts.settings || 'Settings'}</div>
                    <div className='action-button-arrow'>
                        <svg aria-hidden='true' className='ARROW' fill='currentColor' height='1em' viewBox='0 0 24 24' width='1em' style={{ transform: activeSettings ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            <path clipRule='evenodd' d='M4.341 7.247a1 1 0 0 1 1.412.095L12 14.482l6.247-7.14a1 1 0 0 1 1.506 1.317l-7 8a1 1 0 0 1-1.506 0l-7-8a1 1 0 0 1 .095-1.412z' fillRule='evenodd' />
                        </svg>
                    </div>
                </div>
                <div className={`collapse ${activeSettings ? 'show' : ''}`} id='SettingCollapse'>
                    <div className='action-button-list' style={{ paddingLeft: '20px' }} />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
