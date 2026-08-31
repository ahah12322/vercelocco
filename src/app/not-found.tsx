import { redirect } from 'next/navigation';

const NotFound = () => {
    redirect('/contact');
};

export default NotFound;
