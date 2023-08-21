// src/history.js

import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

history.listen((location, action) => {
    if (action === 'POP' || action === 'PUSH') {
        history.location['state'] = history.location['state'] || {};
        history.location['state']['from'] = location.pathname;
    }
});

export default createBrowserHistory();