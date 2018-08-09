import { combineReducers } from 'redux';
import { getHighBid, createNewAuctionItem, getUserTotal } from '../utils';
import {
    SET_AUCTION_DATA,
    SET_AUCTION_ERROR,
    QUICK_BID,
    TOGGLE_DESCRIPTION,
    SELECT_ITEM,
    INPUT_CHANGE,
    ADD_ITEM } from '../actions/actionTypes';

export type ItemData = {
    id: number;
    bids: Bid[];
    title: string;
    // photos: any[];
    description: string;
    viewDetails: boolean;
}

export type Bid = {
    name: string;
    value: number;
}

// TODO: Make this configurable by auction host
export const BID_INCREMENT = 5;

const initialState = {
    error: null,
    isLoaded: false,
    auctionItems: null,
    selectedIndex: 0,
    userTotal: 0,
}

const merge = (root, toMerge) => Object.assign({}, root, toMerge);

export const auctionItems = (state=initialState, action) => {
    console.log(`action:`, action);
    switch (action.type) {
        case SET_AUCTION_DATA:
            const auctionItems = action.rawAuctionItems.map((item, i) => {
                // I don't love having viewDetails as an added property on each item...
                // Is there a better way to do this?
                const viewDetails = (state.auctionItems && state.auctionItems[i])
                    ? state.auctionItems[i].viewDetails
                    : false;
                return merge(item, { id: i, viewDetails });
            });
            const userTotal = getUserTotal(auctionItems, action.userName);
            return merge(state, { auctionItems, userTotal, isLoaded: true });
        case SET_AUCTION_ERROR:
            return merge(state, { error: action.err, isLoaded: true });
        case SELECT_ITEM:
            return merge(state, { selectedIndex: action.itemID });
        case QUICK_BID:
        case TOGGLE_DESCRIPTION:
        case ADD_ITEM:
        case INPUT_CHANGE:
            return item(state, action);
        default:
            return state;
    }
}

const item = (state, action) => {
    const { userName, itemID } = action;

    const itemsCopy = [...state.auctionItems];
    const itemCopy = (itemID !== null) && itemsCopy[itemID];
    switch (action.type) {
        case QUICK_BID:
            const newHighBid = getHighBid(itemCopy.bids).value + BID_INCREMENT;
            itemCopy.bids.push({ name: userName, value: newHighBid });
            const userTotal = getUserTotal(itemsCopy, userName);
            return merge(state, { auctionItems: itemsCopy, userTotal });
        case TOGGLE_DESCRIPTION:
            itemCopy.viewDetails = !itemCopy.viewDetails;
            return merge(state, { auctionItems: itemsCopy });
        case ADD_ITEM:
            const newItem = createNewAuctionItem({ id: itemsCopy.length });
            return merge(state, { auctionItems: [...itemsCopy, newItem], selectedIndex: newItem.id });
        case INPUT_CHANGE:
            const inputChangeItem = itemsCopy[state.selectedIndex];
            const { key, value } = action;
            if (key === 'minBid') {
                inputChangeItem.bids[0].value = parseInt(value);
            } else {
                inputChangeItem[key] = value;
            }
            return merge(state, { auctionItems: itemsCopy });
    }
}