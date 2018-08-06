import { FETCH_ITEMS_FULFILLED, FETCH_ITEMS_REJECTED } from '../actions/actionTypes';

const initialState = {
    error: null,
    isLoaded: false,
    auctionItems: null
}

export const auctionItems = (state=initialState, action) => {
    console.log(`action.type:`, action.type);
    return (action.type === FETCH_ITEMS_FULFILLED) ? Object.assign({}, state, { isLoaded: true, auctionItems: action.payload.data })
        : (action.type === FETCH_ITEMS_REJECTED) ? Object.assign({}, state, { error: action.err, isLoaded: true })
        : state;
}