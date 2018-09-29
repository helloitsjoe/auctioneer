import { DATA_URL } from '../utils';
import { ADD_ITEM, SELECT_ITEM, INPUT_CHANGE, DELETED_ITEM } from './actionTypes';
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
        if (response.data) {
            dispatch(deleteItem(response.data));
        } else {
            console.error('response.data does not exist');
        }
    }).catch(err => console.error(err));
}
const deleteItem = (itemsAfterDelete: ItemData[]) => ({ type: DELETED_ITEM, itemsAfterDelete });