import { createStore, applyMiddleware, combineReducers } from 'redux';
import { auctionItems } from './reducers';
// import promise from 'redux-promise-middleware';

// const middleware = applyMiddleware(promise());
// const rootReducer = combineReducers({ auctionItems: auctionItems });

export const initStore = () => createStore(auctionItems);