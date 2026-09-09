'use client';

import type { FC } from 'react';

interface SearchModalProps {
    show: boolean;
    onClose: () => void;
    texts: Record<string, string>;
}

const SearchModal: FC<SearchModalProps> = ({ show, onClose, texts }) => {
    if (!show) return null;

    return (
        <div className='modal show d-block' id='searchModal' tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className='modal-dialog modal-dialog-centered modal-fullscreen-lg-down' onClick={(e) => e.stopPropagation()}>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <button type='button' className='btn-close' onClick={onClose} aria-label='Close' />
                    </div>
                    <div className='modal-body'>
                        <h4 className='modal-title' id='SearchModalLabel'>
                            {texts.search || 'Search'}
                        </h4>
                        <div className='search-input-wraper'>
                            <input placeholder={texts.searchPlaceholder || 'Search the Privacy Center'} />
                            <div className='search-icon-wraper'>
                                <svg aria-hidden='true' fill='currentColor' height='1em' viewBox='0 0 24 24' width='1em'>
                                    <path clipRule='evenodd' d='M16.618 18.032a9 9 0 1 1 1.414-1.414l3.675 3.675a1 1 0 0 1-1.414 1.414l-3.675-3.675zM18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0z' fillRule='evenodd' />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
