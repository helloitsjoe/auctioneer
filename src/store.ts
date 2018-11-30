import { createStore, applyMiddleware } from 'redux';
import { auctionReducer } from './reducers';
import thunk from 'redux-thunk';

export const initStore = (services = {}) => {
    const middleware = applyMiddleware(thunk.withExtraArgument(services));
    return createStore(auctionReducer, middleware);
}