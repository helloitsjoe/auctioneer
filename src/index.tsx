import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import { initStore } from './store';

ReactDOM.render(
    <Provider store={initStore()}>
        <App />
    </Provider>,
    document.getElementById('main')
);
