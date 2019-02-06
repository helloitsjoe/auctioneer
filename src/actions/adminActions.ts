import {
    AuctionItem,
    SUBMIT_CHANGE_SUCCESS,
    SUBMIT_CHANGE_ERROR,
    DELETE_ITEM_SUCCESS,
    DELETE_ITEM_ERROR,
    StoreState,
} from '../reducers';
import { Dispatch } from 'redux';
import FetchService from '../fetchService';

export const submitChange = (item: AuctionItem, userName?: string) => (
    dispatch: Dispatch,
    getState: () => StoreState,
    fetchService: FetchService
) => {
    return fetchService
        .updateItem(item)
        .then(response => {
            const updatedItem = response.data;
            dispatch(submitChangeSuccess(updatedItem, userName));
            return { updatedItem };
        })
        .catch(err => {
            dispatch(submitChangeError());
        });
};
export const submitChangeError = () => ({ type: SUBMIT_CHANGE_ERROR });
export const submitChangeSuccess = (
    updatedItem: AuctionItem,
    userName: string
) => ({ type: SUBMIT_CHANGE_SUCCESS, updatedItem, userName });

export const deleteRequest = (itemID: number) => (
    dispatch: Dispatch,
    getState: () => StoreState,
    fetchService: FetchService
) => {
    return fetchService
        .deleteItem(itemID)
        .then(response => {
            const { deletedItemID } = response.data;
            dispatch(deleteItemSuccess(deletedItemID));
            return { deletedItemID };
        })
        .catch(err => console.error(err.message));
};
export const deleteItemError = () => ({ type: DELETE_ITEM_ERROR });
export const deleteItemSuccess = (deletedItemID: number) => ({
    type: DELETE_ITEM_SUCCESS,
    deletedItemID,
});
