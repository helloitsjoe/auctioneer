import { Dispatch } from 'redux';
import {
    StoreState,
    AuctionItem,
    FETCH_AUCTION_SUCCESS,
    FETCH_AUCTION_ERROR,
    QUICK_BID,
    TOGGLE_DESCRIPTION,
    selectItem,
} from '../reducers';
import FetchService from '../fetchService';
import { submitChange } from './adminActions';

export const fetchAuctionData = (userName: string) => (
    dispatch: Dispatch,
    getState: () => StoreState,
    fetchService: FetchService
) => {
    return fetchService
        .fetchItems()
        .then(res => {
            const rawAuctionItems = res && res.data;
            if (!rawAuctionItems) {
                throw new Error('No auction data!');
            }
            dispatch(fetchAuctionSuccess({ userName, rawAuctionItems }));
            return res;
        })
        .catch(err => dispatch(fetchAuctionError(err)));
};
export const fetchAuctionError = err => ({ type: FETCH_AUCTION_ERROR, err });
export const fetchAuctionSuccess = ({ userName, rawAuctionItems }) => ({
    type: FETCH_AUCTION_SUCCESS,
    userName,
    rawAuctionItems,
});

export const quickBid = (
    userName: string,
    itemID: number,
    unitTest: boolean = false
) => (dispatch, getState) => {
    dispatch({ type: QUICK_BID, userName, itemID });
    const updatedItem = selectItem(getState(), itemID);
    if (updatedItem && !unitTest) {
        dispatch(submitChange(updatedItem, userName));
    }
};
export const toggleDescription = (itemID: number) => ({
    type: TOGGLE_DESCRIPTION,
    itemID,
});
