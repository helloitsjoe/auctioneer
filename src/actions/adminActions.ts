import { DATA_URL } from '../utils';
import {
    AuctionItem,
    SUBMIT_CHANGE_SUCCESS,
    SUBMIT_CHANGE_ERROR,
    DELETE_ITEM_SUCCESS,
    DELETE_ITEM_ERROR,
} from '../reducers';

export const submitChange = (
    body: AuctionItem,
    userName?: string,
    dataURL: string = DATA_URL,
    adapter: any = null
) => (dispatch, getState, services) => {
    return services.axios
        .put(`${dataURL}/${body.id}`, { body }, { adapter })
        .then(response => {
            const { updatedItem } = response.data;
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

export const deleteRequest = (
    itemID: number,
    dataURL: string = DATA_URL,
    adapter: any = null
) => (dispatch, getState, services) => {
    return services.axios
        .delete(`${dataURL}/${itemID}`, { adapter })
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
