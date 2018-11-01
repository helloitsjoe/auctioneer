import { DATA_URL } from '../utils';
import { ADD_ITEM, SELECT_ITEM, INPUT_CHANGE, DELETE_ITEM_SUCCESS } from '../reducers';
import { InputKey } from '../admin/ItemEditor';
import { ItemData } from '../reducers';

export const addItem = () => ({ type: ADD_ITEM });
export const selectItem = (itemID: number) => ({ type: SELECT_ITEM, itemID });
export const inputChange = (value: string, key) => ({ type: INPUT_CHANGE, key, value });
export const putRequest = (body) => (dispatch, _, services) => {
    services.axios.put(`${DATA_URL}/${body.id}`, { body: JSON.stringify(body) });
}
export const deleteRequest = (itemID) => (dispatch, _, services) => {
    services.axios.delete(`${DATA_URL}/${itemID}`).then(response => {
        const { deletedItemID } = response.data;
        if (deletedItemID == null) {
            throw new Error(`There was an error deleting item ${itemID}`);
        }
        dispatch(deleteItemSuccess(deletedItemID));
    }).catch(err => console.error(err));
}
export const deleteItemSuccess = (deletedItemID: number) => ({ type: DELETE_ITEM_SUCCESS, deletedItemID });