import { DATA_URL } from '../utils';
import { ItemData, ADD_ITEM, ITEM_FOCUSED, INPUT_CHANGE, DELETE_ITEM_SUCCESS } from '../reducers';
import { InputKey } from '../admin/ItemEditor';

export const addItem = () => ({ type: ADD_ITEM });
export const itemFocus = (itemIndex: number) => ({ type: ITEM_FOCUSED, itemIndex });
export const inputChange = (value: string, key: InputKey) => ({ type: INPUT_CHANGE, key, value });
export const putRequest = (body: ItemData) => (dispatch, _, services) => {
    services.axios.put(`${DATA_URL}/${body.id}`, { body: JSON.stringify(body) });
}
export const deleteRequest = (itemID: number) => (dispatch, _, services) => {
    services.axios.delete(`${DATA_URL}/${itemID}`).then(response => {
        const { deletedItemID } = response.data;
        if (deletedItemID == null) {
            throw new Error(`There was an error deleting item ${itemID}`);
        }
        dispatch(deleteItemSuccess(deletedItemID));
    }).catch(console.error);
}
export const deleteItemSuccess = (deletedItemID: number) => ({ type: DELETE_ITEM_SUCCESS, deletedItemID });