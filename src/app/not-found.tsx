import { redirect } from 'next/navigation';
import { ROOT_REDIRECT_URL } from '@/utils/root-redirect';

const NotFound = () => {
    redirect(ROOT_REDIRECT_URL);
};

export default NotFound;
