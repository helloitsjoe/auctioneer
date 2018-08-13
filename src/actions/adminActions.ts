import axios from 'axios';
import { DATA_URL } from '../utils';
import { ADD_ITEM, SELECT_ITEM, INPUT_CHANGE, DELETE_ITEM } from './actionTypes';
import { InputKey } from '../admin/containers/ItemEditor';

export const addItem = () => ({ type: ADD_ITEM });
export const selectItem = (itemID: number) => ({ type: SELECT_ITEM, itemID });
export const inputChange = (key: InputKey, value: string) => ({ type: INPUT_CHANGE, key, value });
export const submitRequest = (body) => (dispatch) => {
    axios.put(DATA_URL, { body });
}
export const deleteRequest = (itemID) => (dispatch) => {
    axios.delete(DATA_URL, { data: { id: itemID } }).then(response => {
        dispatch(deleteItem(itemID));
    });
}
const deleteItem = (itemID: number) => ({ type: DELETE_ITEM, itemID });