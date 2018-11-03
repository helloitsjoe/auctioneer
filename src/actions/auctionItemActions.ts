import {
    ItemData,
    SET_AUCTION_DATA,
    SET_AUCTION_ERROR,
    QUICK_BID,
    TOGGLE_DESCRIPTION,
} from '../reducers';
import { putRequest } from './adminActions';

export const setAuctionData = (rawAuctionItems: ItemData[], userName: string) => ({
    userName,
    rawAuctionItems,
    type: SET_AUCTION_DATA,
});
export const setAuctionError = (err) => ({ type: SET_AUCTION_ERROR, err });

export const quickBidAction = (userName: string, itemID: number) => (dispatch, getState) => {
    dispatch({ type: QUICK_BID, userName, itemID });
    const updatedItem = getState().auctionItems.find(({id}) => id === itemID);
    dispatch(putRequest(updatedItem));
};
export const toggleDescriptionAction = (itemID: number) => ({ type: TOGGLE_DESCRIPTION, itemID });
