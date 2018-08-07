import { createStore, applyMiddleware, combineReducers } from 'redux';
import { setAuctionItems } from './reducers/fetchItemsReducer';
import promise from 'redux-promise-middleware';

const middleware = applyMiddleware(promise());
// const rootReducer = combineReducers({ auctionItems: auctionItems });

export const initStore = () => createStore(setAuctionItems, middleware);