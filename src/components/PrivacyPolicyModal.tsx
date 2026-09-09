'use client';

import DirImg from '@/assets/images/dir.png';
import StarImg from '@/assets/images/star.png';
import { ArrowIcon } from '@/components/icons';
import type { FC } from 'react';

interface PrivacyPolicyModalProps {
    show: boolean;
    onClose: () => void;
    selectedQuestion?: string | null;
    texts: Record<string, string>;
}

const PrivacyPolicyModal: FC<PrivacyPolicyModalProps> = ({ show, onClose, selectedQuestion, texts }) => {
    if (!show) return null;

    const defaultQuestion = selectedQuestion || texts.privacyQ1 || 'What is the Privacy Policy and what does it cover?';

    return (
        <div className='modal form-modal show d-block' id='policyModal' tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <button type='button' className='btn-close' onClick={onClose} aria-label='Close' />
                    </div>
                    <div className='modal-body'>
                        <h4 className='modal-title' id='policyModalLabel'>
                            {texts.privacyPolicy || 'Privacy Policy'}
                        </h4>
                        <h5>{defaultQuestion}</h5>
                        <div className='action-button wide'>
                            <div className='action-button-img'>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img alt='' src={StarImg.src} />
                            </div>
                            <div className='action-button-text'>
                                <span className='small-grey'>{texts.mainInSection || 'The main thing in the section'}</span>
                            </div>
                            <div className='action-button-arrow'>
                                <ArrowIcon />
                            </div>
                        </div>
                        <br />
                        <p>
                            {texts.privacyDesc1 || "At Meta, we want you to understand what information we collect, how we use it, and with whom we use it. let's share. Therefore, we recommend that you read our Privacy Policy. This will help you use"}{' '}
                            <a className='add-svg' target='_blank' rel='noopener noreferrer'>
                                Meta
                            </a>
                            {texts.privacyDesc2 || "'s products the way you need."}
                        </p>
                        <br />
                        <p>{texts.privacyDesc3}</p>
                        <br />
                        <p>
                            {texts.privacyDesc4}{' '}
                            <a className='add-svg' target='_blank' rel='noopener noreferrer'>
                                {texts.updateSettings || 'update these settings'}
                            </a>{' '}
                            {texts.privacyDesc5}
                        </p>
                        <br />
                        <p>{texts.ourPolicies || 'Our policies.'}</p>
                        <br />
                        <div className='action-button-list'>
                            <div className='action-button wide'>
                                <div className='action-button-text'>
                                    <span className='small-grey'>{texts.whatProducts || 'What products are covered by this policy?'}</span>
                                </div>
                                <div className='action-button-arrow'>
                                    <ArrowIcon />
                                </div>
                            </div>
                            <div className='action-button wide'>
                                <div className='action-button-text'>
                                    <span className='small-grey'>{texts.learnMorePrivacy || 'Learn more about managing your privacy at Privacy Center'}</span>
                                </div>
                                <div className='action-button-arrow'>
                                    <ArrowIcon />
                                </div>
                            </div>
                        </div>
                        <br />
                        <h5>{texts.whatInfoCollect || 'What information do we collect?'}</h5>
                        <br />
                        <p>
                            {texts.infoCollectDesc1}{' '}
                            <a className='add-svg'>{texts.products || 'Products'}</a>
                            {texts.infoCollectDesc2}{' '}
                            <a className='add-svg'>{texts.evenNoAccount || 'even if you do not have an account'}</a>.
                        </p>
                        <br />
                        <p>{texts.typesOfData || 'The following are the types of data we collect:'}</p>
                        <br />
                        <div className='action-button-list'>
                            {[texts.yourActions, texts.friendsSubscribers, texts.appBrowserDevice, texts.infoFromPartners].map((label, i) => (
                                <div key={i} className='action-button wide'>
                                    <div className='action-button-text'>
                                        <span className='small-grey'>{label}</span>
                                    </div>
                                    <div className='action-button-arrow'>
                                        <ArrowIcon />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <br />
                        <h5>{texts.whatIfNotAllow || 'What happens if you do not allow us to collect certain types of information?'}</h5>
                        <br />
                        <p>{texts.someInfoNecessary}</p>
                        <p>
                            <a>{texts.moreDetails || 'More details'} &gt;</a>
                        </p>
                        <br />
                        <h5>{texts.whatIfNoIdentify || 'What if the information we collect does not personally identify individuals?'}</h5>
                        <br />
                        <p>{texts.deIdentifyDesc}</p>
                        <br />
                        <h5>{texts.dataControl || 'Data control'}</h5>
                        <div className='action-button wide'>
                            <div className='action-button-img'>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img alt='' src={DirImg.src} />
                            </div>
                            <div className='action-button-text'>
                                <span>{texts.manageInfoCollect || 'Manage the information we collect about you'}</span>
                                <br />
                                <span className='small-grey'>{texts.privacyCenter || 'Privacy Center'}</span>
                            </div>
                            <div className='action-button-arrow'>
                                <ArrowIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyModal;
