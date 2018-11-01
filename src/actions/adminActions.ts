import { DATA_URL } from '../utils';
import { ADD_ITEM, SELECT_ITEM, INPUT_CHANGE, DELETE_ITEM_SUCCESS } from './actionTypes';
import { InputKey } from '../admin/containers/ItemEditor';
import { ItemData } from '../reducers';

export const addItem = () => ({ type: ADD_ITEM });
export const selectItem = (itemID: number) => ({ type: SELECT_ITEM, itemID });
export const inputChange = (value: string, key) => ({ type: INPUT_CHANGE, key, value });
export const putRequest = (body) => (dispatch, _, services) => {
    services.axios.put(`${DATA_URL}/${body.id}`, { body: JSON.stringify(body) });
}
export const deleteRequest = (itemID) => (dispatch, _, services) => {
    services.axios.delete(`${DATA_URL}/${itemID}`).then(response => {
        if (!response.data) {
            throw new Error('The item you were trying to delete does not exist');
        }
        dispatch(deleteItemSuccess(response.data));
    }).catch(err => console.error(err));
}
const deleteItemSuccess = (itemsAfterDelete: ItemData[]) => ({ type: DELETE_ITEM_SUCCESS, itemsAfterDelete });