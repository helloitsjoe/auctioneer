import { getHighBid, createNewAuctionItem, getUserTotal } from '../utils';

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

// Action types
export const SET_AUCTION_DATA = 'SET_AUCTION_DATA';
export const SET_AUCTION_ERROR = 'SET_AUCTION_ERROR';

export const QUICK_BID = 'QUICK_BID';
export const TOGGLE_DESCRIPTION = 'TOGGLE_DESCRIPTION';

export const ADD_ITEM = 'ADD_ITEM';
export const SELECT_ITEM = 'SELECT_ITEM';
export const DELETE_ITEM_SUCCESS = 'DELETE_ITEM_SUCCESS';
export const INPUT_CHANGE = 'INPUT_CHANGE';

const initialState = {
    error: null,
    isLoaded: false,
    auctionItems: [],
    selectedIndex: 0,
    userTotal: 0,
}

const merge = (root, toMerge) => Object.assign({}, root, toMerge);

export const auctionItems = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUCTION_DATA:
            const { rawAuctionItems } = action;
            const auctionItems = rawAuctionItems.length ? rawAuctionItems.map((item) => {
                // Is there a better way to do this?
                const itemInState = state.auctionItems.find(({id}) => id === item.id)
                const viewDetails = !!(itemInState && itemInState.viewDetails);
                return merge(item, { viewDetails });
            }) : [createNewAuctionItem()];
            const userTotalMaybeOutbid = getUserTotal(auctionItems, action.userName);
            return merge(state, { auctionItems, userTotal: userTotalMaybeOutbid, isLoaded: true });
        case SET_AUCTION_ERROR:
            return merge(state, { error: action.err, isLoaded: true });
        case SELECT_ITEM:
            return merge(state, { selectedIndex: action.itemIndex });
        case ADD_ITEM:
        case QUICK_BID:
        case INPUT_CHANGE:
        case DELETE_ITEM_SUCCESS:
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
    const itemCopy = (itemID != null) && itemsCopy.find(({id}) => id === itemID);
    switch (action.type) {
        case QUICK_BID:
            const newHighBid = getHighBid(itemCopy.bids).value + BID_INCREMENT;
            itemCopy.bids.push({ name: userName, value: newHighBid });
            const userTotal = getUserTotal(itemsCopy, userName);
            return merge(state, { auctionItems: itemsCopy, userTotal });
        case TOGGLE_DESCRIPTION:
            itemCopy.viewDetails = !itemCopy.viewDetails;
            return merge(state, { auctionItems: itemsCopy });
        case DELETE_ITEM_SUCCESS:
            const { deletedItemID } = action;
            const itemsAfterDelete = auctionItems.filter(item => item.id !== deletedItemID);
            const safeItemsAfterDelete = itemsAfterDelete.length ? itemsAfterDelete : [createNewAuctionItem()];
            const newSelectedIndex = selectedIndex >= safeItemsAfterDelete.length ? safeItemsAfterDelete.length - 1 : selectedIndex;
            return merge(state, { auctionItems: safeItemsAfterDelete, selectedIndex: newSelectedIndex });
        case ADD_ITEM:
            const newItem = createNewAuctionItem(itemsCopy);
            const auctionItemsWithNew = [...itemsCopy, newItem]
            return merge(state, { auctionItems: auctionItemsWithNew, selectedIndex: auctionItemsWithNew.indexOf(newItem) });
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