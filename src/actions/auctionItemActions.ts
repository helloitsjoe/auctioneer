import {
    ItemData,
    SET_AUCTION_DATA,
    SET_AUCTION_ERROR,
    QUICK_BID,
    TOGGLE_DESCRIPTION,
    selectItem
} from '../reducers';
import { putRequest } from './adminActions';

export const setAuctionData = (rawAuctionItems: ItemData[], userName: string) => ({
    userName,
    rawAuctionItems,
    type: SET_AUCTION_DATA,
});
export const setAuctionError = (err) => ({ type: SET_AUCTION_ERROR, err });

export const quickBid = (userName: string, itemID: number) => (dispatch, getState) => {
    dispatch({ type: QUICK_BID, userName, itemID });
    const updatedItem = selectItem(getState(), itemID);
    dispatch(putRequest(updatedItem));
};
export const toggleDescription = (itemID: number) => ({ type: TOGGLE_DESCRIPTION, itemID });
