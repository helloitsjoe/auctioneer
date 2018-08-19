import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import ConnectedApp from './containers/App';
import { initStore } from './store';

import axios from 'axios';

ReactDOM.render(
    <Provider store={initStore({ axios })}>
        <ConnectedApp axios={axios} />
    </Provider>, document.getElementById('main'));
