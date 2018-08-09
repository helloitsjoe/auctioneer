import { getHighBid, createNewAuctionItem } from '../utils';
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
            return merge(state, { auctionItems, isLoaded: true });
        case SET_AUCTION_ERROR:
            return merge(state, { error: action.err, isLoaded: true });
        case SELECT_ITEM:
            return merge(state, { selectedIndex: action.itemID });
        case QUICK_BID:
            // TODO: QUICK_BID and TOGGLE_DESCRIPTION feel a little ugly. Fix em up.
            const { userName, itemID } = action;
            const items = [...state.auctionItems];
            const item = items[itemID];
            const newHighBid = getHighBid(item.bids).value + BID_INCREMENT;
            item.bids.push({ name: userName, value: newHighBid });
            return merge(state, { auctionItems: items });
        case TOGGLE_DESCRIPTION:
            const itemsCopy = [...state.auctionItems];
            const itemCopy = itemsCopy[action.itemID];
            itemCopy.viewDetails = !itemCopy.viewDetails;
            return merge(state, { auctionItems: itemsCopy });
        case ADD_ITEM:
            const newItem = createNewAuctionItem({ id: state.auctionItems.length });
            const auctionItemsPlusOne = [...state.auctionItems, newItem];
            return merge(state, { auctionItems: auctionItemsPlusOne, selectedIndex: newItem.id });
        case INPUT_CHANGE:
            const inputChangeItems = [...state.auctionItems];
            const inputChangeItem = inputChangeItems[state.selectedIndex];
            const { key, value } = action;
            if (key === 'minBid') {
                inputChangeItem.bids[0].value = parseInt(value);
            } else {
                inputChangeItem[key] = value;
            }
            return merge(state, { auctionItems: inputChangeItems });
        default:
            return state;
    }
}