import axios from 'axios';
import { DATA_URL } from '../utils';
import { SET_AUCTION_DATA, SET_AUCTION_ERROR, QUICK_BID, TOGGLE_DESCRIPTION } from './actionTypes';

export const setAuctionData = (auctionItems) => ({
    type: SET_AUCTION_DATA,
    auctionItems
});

export const setAuctionError = (err) => ({
    type: SET_AUCTION_ERROR,
    err
});

export const quickItemBid = () => ({
    type: QUICK_BID
});

export const toggleItemDescription = () => ({
    type: TOGGLE_DESCRIPTION
});