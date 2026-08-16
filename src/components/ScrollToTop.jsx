import { useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { rememberSeen, stopAnimations } from '@/lib/motionSession';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const isFirstPage = useRef(true);

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    // The opening animation is a one-time greeting per browser session.
    useEffect(() => {
        if (isFirstPage.current) {
            isFirstPage.current = false;
            rememberSeen(); // a reload later in this session stays still
            return;
        }
        stopAnimations(); // from the second page onwards, no more entrances
    }, [pathname]);

    return null;
}

export default ScrollToTop;
