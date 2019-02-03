import { createStore, applyMiddleware } from 'redux';
import { auctionReducer } from './reducers';
import thunk from 'redux-thunk';
import FetchService from './fetchService';

export const initStore = (fetchService = new FetchService()) => {
    const middleware = applyMiddleware(thunk.withExtraArgument(fetchService));
    return createStore(auctionReducer, middleware);
};
