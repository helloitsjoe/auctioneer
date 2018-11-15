import { DATA_URL } from '../utils';
import { ItemData, ADD_ITEM, ITEM_FOCUSED, INPUT_CHANGE, SUBMIT_CHANGE_SUCCESS, DELETE_ITEM_SUCCESS } from '../reducers';
import { InputKey } from '../admin/ItemEditor';

export const addItem = () => ({ type: ADD_ITEM });
export const itemFocus = (itemIndex: number) => ({ type: ITEM_FOCUSED, itemIndex });
export const inputChange = (value: string, key: InputKey) => ({ type: INPUT_CHANGE, key, value });
export const submitChange = (
    body: ItemData,
    dataURL: string = DATA_URL,
    adapter: any = null
) => (dispatch, getState, services) => {
    return services.axios.put(`${dataURL}/${body.id}`,
        { body: JSON.stringify(body) },
        { adapter }
    ).then(response => {
        const { updatedItem } = response.data;
        dispatch(submitChangeSuccess(updatedItem));
        return { updatedItem };
    }).catch(err => console.error(err.message));
}
export const submitChangeSuccess = (updatedItem: ItemData) => ({ type: SUBMIT_CHANGE_SUCCESS, updatedItem });
export const deleteRequest = (
    itemID: number,
    dataURL: string = DATA_URL,
    adapter: any = null
) => (dispatch, getState, services) => {
    return services.axios.delete(`${dataURL}/${itemID}`, { adapter }).then(response => {
        const { deletedItemID } = response.data;
        dispatch(deleteItemSuccess(deletedItemID));
        return { deletedItemID };
    }).catch(err => console.error(err.message));
}
export const deleteItemSuccess = (deletedItemID: number) => ({ type: DELETE_ITEM_SUCCESS, deletedItemID });