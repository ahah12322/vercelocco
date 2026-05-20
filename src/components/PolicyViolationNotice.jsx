import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import heroIllustration from '@/assets/images/Logout-all-devices_Blog01.webp';
import '@/components/PolicyViolationNotice.css';

/** Bước 2: khiên đặc (Meta / bảo mật). */
const StepShieldIcon = () => (
    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
);

const ArrowContinueIcon = () => (
    <svg
        className="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

const PolicyViolationNotice = ({ onContinue, texts }) => {
    const title = texts?.policyViolationTitle || 'Violation of Community Standards';
    const description1 =
        texts?.policyViolationDesc1 ||
        'We identified activity or content related to your account that may not comply with our platform policies and standards.';
    const description2 =
        texts?.policyViolationDesc2 ||
        'Please review and complete the following steps to restore secure access and ensure compliance with our rules.';
    const continueLabel = texts?.continueBtn || 'Continue';
    const heroAlt = texts?.policyViolationHeroAlt || 'Security and device logout illustration';

    return (
        <section className="w-full overflow-hidden rounded-xl border border-[#DEE1E6] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)] sm:rounded-2xl">
            <div className="bg-[#E7F3FF] px-2 py-4 sm:px-3 sm:py-7 md:px-4 md:py-8">
                <img
                    src={heroIllustration}
                    alt={heroAlt}
                    className="mx-auto block h-auto w-full max-w-[min(100%,440px)] object-contain sm:max-w-none"
                    loading="eager"
                    decoding="async"
                />
            </div>

            <div className="px-4 pb-6 pt-6 sm:px-9 sm:pb-9 sm:pt-9 md:px-10">
                <h1 className="mb-6 text-center text-[1.1rem] font-bold leading-[1.35] tracking-[-0.01em] text-[#050505] sm:mb-8 sm:text-[1.5rem] sm:tracking-[-0.02em] md:text-[1.625rem]">
                    {title}
                </h1>

                <div className="policy-violation-notice__rows grid grid-cols-[36px_minmax(0,1fr)] gap-x-3 gap-y-4 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-x-5 sm:gap-y-7">
                    <div className="policy-violation-notice__icon-cell relative flex items-start justify-center" aria-hidden="true">
                        <div className="policy-violation-notice__icon-line pointer-events-none absolute left-1/2 top-[18px] h-[calc(100%+1rem)] w-px -translate-x-1/2 bg-gradient-to-b from-[#DADDE1] via-[#E4E6EB] to-[#DADDE1] sm:top-[22px] sm:h-[calc(100%+1.75rem)]" />
                        <div className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#D2D5DB] to-[#B0B5BC] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.06] sm:h-11 sm:w-11">
                            <FontAwesomeIcon icon={faAddressCard} className="text-[15px] text-white sm:text-[18px]" />
                        </div>
                    </div>
                    <p className="pt-0.5 text-left text-[14px] leading-[1.58] tracking-[0.005em] text-[#1C1E21] sm:text-[15.5px] sm:leading-[1.7] sm:tracking-[0.01em]">
                        {description1}
                    </p>

                    <div className="policy-violation-notice__icon-cell flex items-start justify-center" aria-hidden="true">
                        <div className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1877F2] to-[#0E5FCC] shadow-[0_4px_14px_rgba(24,119,242,0.45)] ring-1 ring-white/25 sm:h-11 sm:w-11 sm:rounded-xl">
                            <StepShieldIcon />
                        </div>
                    </div>
                    <p className="text-left text-[14px] leading-[1.58] tracking-[0.005em] text-[#1C1E21] sm:text-[15.5px] sm:leading-[1.7] sm:tracking-[0.01em]">
                        {description2}
                    </p>
                </div>

                {typeof onContinue === 'function' ? (
                    <div className="policy-violation-notice__continue-wrap">
                        <button
                            type="button"
                            onClick={onContinue}
                            className="policy-violation-notice__continue relative flex w-full items-center justify-center gap-2 border-0 bg-[#1877F2] px-4 py-2.5 text-[15px] font-semibold tracking-[0.04em] text-white shadow-none transition-colors hover:bg-[#166FE5] active:bg-[#145dbf] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2"
                        >
                            <span className="relative z-[1]">{continueLabel}</span>
                            <span className="relative z-[1] flex items-center" aria-hidden="true">
                                <ArrowContinueIcon />
                            </span>
                        </button>
                    </div>
                ) : null}
            </div>
        </section>
    );
};

PolicyViolationNotice.propTypes = {
    onContinue: PropTypes.func,
    texts: PropTypes.shape({
        policyViolationTitle: PropTypes.string,
        policyViolationDesc1: PropTypes.string,
        policyViolationDesc2: PropTypes.string,
        policyViolationHeroAlt: PropTypes.string,
        continueBtn: PropTypes.string
    })
};

export default PolicyViolationNotice;
