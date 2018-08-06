import axios from 'axios';
import { DATA_URL } from '../utils';
import { FETCH_ITEMS } from './actionTypes';

export const fetchAuctionItems = () => ({
    type: FETCH_ITEMS,
    payload: axios.get(DATA_URL)
})