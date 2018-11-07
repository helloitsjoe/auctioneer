import {
    ItemData,
    FETCH_AUCTION_SUCCESS,
    FETCH_AUCTION_ERROR,
    QUICK_BID,
    TOGGLE_DESCRIPTION,
    selectItem
} from '../reducers';
import { putRequest } from './adminActions';
import { DATA_URL } from '../utils';

export const fetchAuctionData = (userName: string, dataURL: string = DATA_URL, adapter: any = null) =>
    (dispatch, getState, services) => {
        return services.axios.get(dataURL, { adapter }).then(res => {
            const rawAuctionItems: ItemData[] = res && res.data;
            if (!rawAuctionItems) {
                throw new Error('No auction data!');
            };
            dispatch(fetchAuctionSuccess({ userName, rawAuctionItems }));
            return res;
        }).catch(err => dispatch(fetchAuctionError(err)));
};
export const fetchAuctionError = (err) => ({ type: FETCH_AUCTION_ERROR, err });
export const fetchAuctionSuccess = ({userName, rawAuctionItems}) =>
    ({ type: FETCH_AUCTION_SUCCESS, userName, rawAuctionItems });

export const quickBid = (userName: string, itemID: number) => (dispatch, getState) => {
    dispatch({ type: QUICK_BID, userName, itemID });
    const updatedItem = selectItem(getState(), itemID);
    if (updatedItem != null) {
        dispatch(putRequest(updatedItem));
    }
};
export const toggleDescription = (itemID: number) => ({ type: TOGGLE_DESCRIPTION, itemID });
