import { ADD_ITEM, SELECT_ITEM, INPUT_CHANGE } from './actionTypes';
import { InputKey } from '../admin/containers/ItemEditor';

export const addItem = () => ({ type: ADD_ITEM });
export const selectItem = (itemID: number) => ({ type: SELECT_ITEM, itemID });
export const inputChange = (key: InputKey, value: string) => ({ type: INPUT_CHANGE, key, value })