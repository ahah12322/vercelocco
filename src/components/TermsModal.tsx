'use client';

import { ArrowIcon } from '@/components/icons';
import type { FC } from 'react';

interface TermsModalProps {
    show: boolean;
    onClose: () => void;
    texts: Record<string, string>;
}

const TermsModal: FC<TermsModalProps> = ({ show, onClose, texts }) => {
    if (!show) return null;

    return (
        <div className='modal form-modal show d-block' id='TermsModal' tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <button type='button' className='btn-close' onClick={onClose} aria-label='Close' />
                    </div>
                    <div className='modal-body'>
                        <h4 className='modal-title' id='TermsModalLabel'>
                            {texts.termsOfUse || 'Terms of use'}
                        </h4>
                        <p>
                            {texts.termsDesc1}
                            <a className='add-svg'>{texts.metaProducts || 'Meta Products'}</a>
                            {texts.termsDesc2}
                            <a className='add-svg'>{texts.products || 'Products'}</a>
                            {texts.termsDesc3}
                        </p>
                        <br />
                        <p>
                            {texts.termsDesc4}
                            <a className='add-svg'>{texts.privacyPolicy || 'Privacy Policy'}</a>
                            {texts.termsDesc5}
                            <a className='add-svg'>{texts.settings || 'settings'}</a>
                            {texts.termsDesc6}
                        </p>
                        <br />
                        <h6>{texts.servicesWeProvide || 'Services we provide'}</h6>
                        <ul>
                            {[texts.service1, texts.service2, texts.service3, texts.service4, texts.service5, texts.service6, texts.service7, texts.service8, texts.service9].map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                        <h6>{texts.otherTermsPolicies || 'Other terms and policies that may apply to you'}</h6>
                        <ul>
                            <li>
                                <a className='add-svg'>{texts.advertisingRules || 'Advertising Rules'}</a>
                                {texts.advertisingRulesDesc}
                            </li>
                            <li>
                                <a className='add-svg'>{texts.communityStandards || 'Community Standards'}</a>
                                {texts.communityStandardsDesc}
                            </li>
                            <li>
                                <a className='add-svg'>{texts.communityPaymentTerms || 'Community Payment Terms'}</a>
                                {texts.communityPaymentTermsDesc}
                            </li>
                            <li>
                                <a className='add-svg'>{texts.commercialTerms || 'Commercial terms'}</a>
                                {texts.commercialTermsDesc}
                            </li>
                            <li>
                                <a className='add-svg'>{texts.tradeRules || 'Trade Rules'}</a>
                                {texts.tradeRulesDesc}
                            </li>
                        </ul>
                        <p>{texts.lastRevisionDate || 'Last revision date: July 26, 2023'}</p>
                        <br />
                        <h6>{texts.dataControl || 'Data control'}</h6>
                        <div className='action-button wide'>
                            <div className='action-button-img'>
                                <svg fill='currentColor' height='1em' viewBox='0 0 24 24' width='1em'>
                                    <path d='M12 12a2 2 0 0 1 1 3.732V17a1 1 0 1 1-2 0v-1.268A2 2 0 0 1 12 12z' />
                                    <path
                                        clipRule='evenodd'
                                        d='M7 6a5 5 0 0 1 10 0v2h.857c1.282 0 2.417.818 2.664 2.076A25.71 25.71 0 0 1 21 15a25.71 25.71 0 0 1-.479 4.924C20.274 21.182 19.14 22 17.857 22H6.143c-1.282 0-2.417-.818-2.664-2.076A25.711 25.711 0 0 1 3 15c0-1.984.236-3.692.479-4.924C3.726 8.818 4.86 8 6.143 8H7V6zm8 0v2H9V6a3 3 0 1 1 6 0zm-8.857 4h11.714a.84.84 0 0 1 .508.157c.107.082.17.182.194.305.223 1.133.441 2.71.441 4.538 0 1.828-.218 3.405-.441 4.538a.488.488 0 0 1-.194.305.84.84 0 0 1-.508.157H6.143a.84.84 0 0 1-.508-.157.489.489 0 0 1-.194-.305A23.712 23.712 0 0 1 5 15c0-1.828.218-3.405.441-4.538a.489.489 0 0 1 .194-.305.84.84 0 0 1 .508-.157z'
                                        fillRule='evenodd'
                                    />
                                </svg>
                            </div>
                            <div className='action-button-text'>
                                <span>{texts.accountSecurity || 'Account security'}</span>
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

export default TermsModal;
