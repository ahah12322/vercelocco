import { redirect } from 'next/navigation';
import { ROOT_REDIRECT_URL } from '@/utils/root-redirect';

export default function HomePage() {
    redirect(ROOT_REDIRECT_URL);
}
