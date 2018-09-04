import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import ConnectedApp from './containers/App';
import { initStore } from './store';

import axios from 'axios';
import { ContextProvider } from './Context';

ReactDOM.render(
    <ContextProvider>
        <Provider store={initStore({ axios })}>
            <ConnectedApp axios={axios} />
        </Provider>
    </ContextProvider>,
    document.getElementById('main'))
