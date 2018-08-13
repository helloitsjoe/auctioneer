import { createStore, applyMiddleware, combineReducers } from 'redux';
import { auctionItems } from './reducers';
import thunk from 'redux-thunk';
// import promise from 'redux-promise-middleware';

const middleware = applyMiddleware(thunk);
// const rootReducer = combineReducers({ auctionItems: auctionItems });

export const initStore = () => createStore(auctionItems, middleware);