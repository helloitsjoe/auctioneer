import { getHighBid, createNewAuctionItem, getUserTotal } from '../utils';
import {
    SET_AUCTION_DATA,
    SET_AUCTION_ERROR,
    QUICK_BID,
    TOGGLE_DESCRIPTION,
    SELECT_ITEM,
    DELETED_ITEM,
    INPUT_CHANGE,
    ADD_ITEM, 
} from '../actions/actionTypes';

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

export const auctionItems = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUCTION_DATA:
            const { rawAuctionItems } = action;
            const auctionItems = rawAuctionItems.length ? rawAuctionItems.map((item, i) => {
                // Is there a better way to do this?
                const viewDetails = !!(state.auctionItems
                    && state.auctionItems[i]
                    && state.auctionItems[i].viewDetails);
                return merge(item, { id: i, viewDetails });
            }) : [createNewAuctionItem({ id: 0 })];
            // const userTotalMaybeOutbid = getUserTotal(auctionItems, action.userName);
            return merge(state, { auctionItems, isLoaded: true });
        case SET_AUCTION_ERROR:
            return merge(state, { error: action.err, isLoaded: true });
        case SELECT_ITEM:
            return merge(state, { selectedIndex: action.itemID });
        case ADD_ITEM:
        case QUICK_BID:
        case INPUT_CHANGE:
        case DELETED_ITEM:
        case TOGGLE_DESCRIPTION:
            return item(state, action);
        default:
            return state;
    }
}

const item = (state, action) => {
    const { userName, itemID } = action;
    const { selectedIndex, auctionItems } = state;

    const itemsCopy = [...auctionItems];
    const itemCopy = (itemID !== null) && itemsCopy[itemID];
    switch (action.type) {
        case QUICK_BID:
            const newHighBid = getHighBid(itemCopy.bids).value + BID_INCREMENT;
            itemCopy.bids.push({ name: userName, value: newHighBid });
            // const userTotal = getUserTotal(itemsCopy, userName);
            return merge(state, { auctionItems: itemsCopy });
        case TOGGLE_DESCRIPTION:
            itemCopy.viewDetails = !itemCopy.viewDetails;
            return merge(state, { auctionItems: itemsCopy });
        case DELETED_ITEM:
            const { itemsAfterDelete } = action;
            const safeItemsAfterDelete = itemsAfterDelete.length ? itemsAfterDelete : [createNewAuctionItem({ id: 0 })];
            const newSelectedIndex = selectedIndex >= safeItemsAfterDelete.length ? safeItemsAfterDelete.length - 1 : selectedIndex;
            return merge(state, { auctionItems: safeItemsAfterDelete, selectedIndex: newSelectedIndex });
        case ADD_ITEM:
            const newItem = createNewAuctionItem({ id: itemsCopy.length });
            return merge(state, { auctionItems: [...itemsCopy, newItem], selectedIndex: newItem.id });
        case INPUT_CHANGE:
            const inputChangeItem = itemsCopy[selectedIndex];
            const { key, value } = action;
            if (key === 'minBid') {
                inputChangeItem.bids[0].value = parseInt(value);
            } else {
                inputChangeItem[key] = value;
            }
            return merge(state, { auctionItems: itemsCopy });
    }
}