import { ADD_ITEM, SELECT_ITEM, INPUT_CHANGE } from './actionTypes';

export const addItem = () => ({ type: ADD_ITEM });
export const selectItem = (itemID) => ({ type: SELECT_ITEM, itemID });
export const inputChange = (key, value) => ({ type: INPUT_CHANGE, key, value })