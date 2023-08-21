import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';

import Loading from '../components/loading';

export default function LoadingPage(props) {
    const timeoutRef = useRef(null);
    const history = useHistory();

    useEffect(() => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(()=> {
            timeoutRef.current = null;
            history.push(props?.user?.access ? "/works" : "/login");
        }, 2000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props?.user]);

    return (
        <Loading />
    );
}