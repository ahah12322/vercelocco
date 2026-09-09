'use client';

import Testimonial1 from '@/assets/images/11.webp';
import { tickSrc } from '@/components/icons';
import { useState, type FC } from 'react';

interface TestimonialSectionProps {
    texts: Record<string, string>;
}

const TestimonialSection: FC<TestimonialSectionProps> = ({ texts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            quote: texts.testimonial1 || '"Being Meta Verified has elevated my credibility with my audience. For new followers or potential partners viewing my profile, it shows that I am established and serious about my work."',
            avatar: Testimonial1,
            user: '@kimalban',
            follow: '68K+ followers',
            link: 'https://www.instagram.com/kimalban/'
        },
        {
            quote: texts.testimonial2 || '"Meta Verified helped me build my credibility as a creator."',
            avatar: Testimonial1,
            user: '@sssourabh',
            follow: '90k+ followers',
            link: 'https://www.instagram.com/sssourabh/'
        },
        {
            quote: texts.testimonial3 || '"I like how Meta Verified added an extra layer of security to help protect me from impersonation."',
            avatar: Testimonial1,
            user: '@lizzlovestech',
            follow: '94K+ followers',
            link: 'https://www.instagram.com/lizzlovestech/'
        },
        {
            quote: texts.testimonial4 || '"Meta Verified helped my account stand out from impersonators, which helped me secure more paying clients."',
            avatar: Testimonial1,
            user: '@inversionista_gal',
            follow: '4K+ followers',
            link: 'https://www.instagram.com/inversionista_gal/'
        }
    ];

    const current = testimonials[currentIndex];

    return (
        <div className='mv-testimonial'>
            <div className='mv-quote' id='mvQuote'>
                {current.quote}
            </div>

            <div className='mv-profile'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={current.avatar.src} className='mv-avatar' id='mvAvatar' alt='avatar' />

                <div className='mv-name'>
                    <a id='mvUser' className='mv-user-link' href={current.link} target='_blank' rel='noopener noreferrer'>
                        {current.user}
                    </a>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tickSrc} width='18' alt='tick' style={{ verticalAlign: 'middle' }} />
                </div>

                <div className='mv-follow' id='mvFollow'>
                    {current.follow}
                </div>
            </div>

            <div className='mv-controls'>
                <button type='button' className='mv-btn' id='mvPrev' onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}>
                    ‹
                </button>

                <div className='mv-dots' id='mvDots'>
                    {testimonials.map((_, i) => (
                        <div key={i} className={`mv-dot ${i === currentIndex ? 'active' : ''}`} />
                    ))}
                </div>

                <button type='button' className='mv-btn' id='mvNext' onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}>
                    ›
                </button>
            </div>
        </div>
    );
};

export default TestimonialSection;
