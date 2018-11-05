import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import { initStore } from './store';

import axios from 'axios';

ReactDOM.render(
    <Provider store={initStore({ axios })}>
        <App />
    </Provider>, document.getElementById('main'));
