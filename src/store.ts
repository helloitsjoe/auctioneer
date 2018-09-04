import { createStore, applyMiddleware, combineReducers } from 'redux';
import { auctionItems } from './reducers';
import thunk from 'redux-thunk';
// import promise from 'redux-promise-middleware';

export const initStore = (services = {}) => {
    const middleware = applyMiddleware(thunk.withExtraArgument(services));
    // const rootReducer = combineReducers({ auctionItems: auctionItems });
    return createStore(auctionItems, middleware);
}