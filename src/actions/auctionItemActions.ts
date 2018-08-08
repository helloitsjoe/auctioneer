import { SET_AUCTION_DATA, SET_AUCTION_ERROR, QUICK_BID, TOGGLE_DESCRIPTION } from './actionTypes';
import { ItemData } from '../reducers/auctionItemsReducer';

export const setAuctionData = (rawAuctionItems: ItemData[]) => ({ type: SET_AUCTION_DATA, rawAuctionItems });
export const setAuctionError = (err) => ({ type: SET_AUCTION_ERROR, err });

export const quickBidAction = (userName: string, itemID: number) => ({ type: QUICK_BID, userName, itemID });
export const toggleDescriptionAction = (itemID: number) => ({ type: TOGGLE_DESCRIPTION, itemID });