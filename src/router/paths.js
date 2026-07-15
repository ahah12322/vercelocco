export const PATHS = {
    HOME: '/contact',
    INDEX: '/contact/help'
};

export const REVIEW_PATH_PATTERN = /^\/contact\/help\/(\d+)$/;

export const parseReviewId = (pathname = '') => {
    const match = String(pathname).match(REVIEW_PATH_PATTERN);
    return match?.[1] ?? null;
};

export const generateReviewId = () => String(Date.now());

export const reviewPath = (id) => `${PATHS.INDEX}/${id}`;
