import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import ConnectedApp from './containers/App';
import { initStore } from './store';

ReactDOM.render(
    <Provider store={initStore()}>
        <ConnectedApp />
    </Provider>, document.getElementById('main'));
