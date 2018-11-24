import { getHighBid, createNewAuctionItem, getUserTotal } from './utils';

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

export type StoreState = {
    error: Error;
    dirty: boolean;
    focusedIndex: number;
    missingInfo: boolean;
    origItem: ItemData;
    confirmDiscard: boolean;
    isLoaded: boolean;
    auctionItems: ItemData[];
    userTotal: number;
}

export enum Modal {
    confirmDiscard = 'confirmDiscard',
    missingInfo = 'missingInfo',
}

// TODO: Make this configurable by auction host
export const BID_INCREMENT = 5;

export const FETCH_AUCTION_SUCCESS = 'FETCH_AUCTION_SUCCESS';
export const FETCH_AUCTION_ERROR = 'FETCH_AUCTION_ERROR';

export const QUICK_BID = 'QUICK_BID';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const MISSING_INFO = 'MISSING_INFO';
export const DISCARD_CHANGE = 'DISCARD_CHANGE';
export const TOGGLE_DESCRIPTION = 'TOGGLE_DESCRIPTION';

export const ADD_ITEM = 'ADD_ITEM';
export const ITEM_FOCUSED = 'ITEM_FOCUSED';
export const DELETE_ITEM_SUCCESS = 'DELETE_ITEM_SUCCESS';
export const SUBMIT_CHANGE_SUCCESS = 'SUBMIT_CHANGE_SUCCESS';
export const INPUT_CHANGE = 'INPUT_CHANGE';

const initialState: StoreState = {
    error: null,
    dirty: false,
    focusedIndex: 0,
    origItem: null,
    missingInfo: false,
    confirmDiscard: false,
    isLoaded: false,
    auctionItems: [],
    userTotal: 0,
}

export const auctionItems = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_AUCTION_SUCCESS:
            const { rawAuctionItems } = action;
            const auctionItems = rawAuctionItems.length ? rawAuctionItems.map((item) => {
                // Is there a better way to do this?
                const itemInState = selectItem(state, item.id)
                const viewDetails = !!(itemInState && itemInState.viewDetails);
                return {...item, viewDetails};
            }) : [createNewAuctionItem()];
            const userTotalMaybeOutbid = getUserTotal(auctionItems, action.userName);
            return {...state, auctionItems, userTotal: userTotalMaybeOutbid, isLoaded: true };
        case FETCH_AUCTION_ERROR:
            return { ...state, error: action.err, isLoaded: true };
        case ITEM_FOCUSED:
            return state.dirty ? {...state, confirmDiscard: true }
                : { ...state, focusedIndex: action.itemIndex };
        case DISCARD_CHANGE:
            const origItem = selectOrigItem(state);
            const origAuctionItems = origItem
                ? selectAuctionItems(state).map(item => item.id === origItem.id ? origItem : item)
                : selectAuctionItems(state);
            return {...state, dirty: false, confirmDiscard: false, auctionItems: origAuctionItems}
        case CLOSE_MODAL:
            const { name } = action;
            return {...state, [name]: false }
        case MISSING_INFO:
            return {...state, missingInfo: true }
        case ADD_ITEM:
        case QUICK_BID:
        case INPUT_CHANGE:
        case DELETE_ITEM_SUCCESS:
        case SUBMIT_CHANGE_SUCCESS:
        case TOGGLE_DESCRIPTION:
            return item(state, action);
        default:
            return state;
    }
}

const item = (state: StoreState, action: any) => {
    const { userName, itemID } = action;
    const { focusedIndex, auctionItems } = state;

    const item = (itemID != null) && selectItem(state, itemID);
    switch (action.type) {
        case QUICK_BID:
            if (!item) {
                console.error('Item not found in auctionItems!');
                return state;
            }
            const newHighBid = getHighBid(item.bids).value + BID_INCREMENT;
            const bids = [...item.bids, {name: userName, value: newHighBid }];
            const itemsWithBid = auctionItems.map(item => item.id === itemID ? { ...item, bids} : item);
            const userTotal = getUserTotal(itemsWithBid, userName);
            return {
                ...state,
                auctionItems: itemsWithBid,
                userTotal
            };
        case TOGGLE_DESCRIPTION:
            if (!item) {
                console.error('Item not found in auctionItems!');
                return state;
            }
            const viewDetails = !item.viewDetails;
            const itemsWithToggledDetails = auctionItems.map(item => item.id === itemID ? { ...item, viewDetails} : item);
            return {
                ...state,
                auctionItems: itemsWithToggledDetails
            };
        case DELETE_ITEM_SUCCESS:
            const { deletedItemID } = action;
            const itemsAfterDelete = auctionItems.filter(item => item.id !== deletedItemID);
            const safeItemsAfterDelete = itemsAfterDelete.length ? itemsAfterDelete : [createNewAuctionItem()];
            const newfocusedIndex = focusedIndex >= safeItemsAfterDelete.length ? safeItemsAfterDelete.length - 1 : focusedIndex;
            return {
                ...state,
                auctionItems: safeItemsAfterDelete,
                focusedIndex: newfocusedIndex
            };
        case SUBMIT_CHANGE_SUCCESS:
            const { updatedItem } = action;
            const itemsAfterUpdate = auctionItems.map(item =>
                item.id === updatedItem.id ? { ...item, ...updatedItem } : item);
            return {
                ...state,
                dirty: false,
                confirmDiscard: false,
                auctionItems: itemsAfterUpdate,
                origItem: null
            };
        case ADD_ITEM:
            const blankItemIndex = auctionItems.findIndex(item => !item.title.length);
            if (blankItemIndex > -1) {
                return { ...state, focusedIndex: blankItemIndex };
            }
            const newItem = createNewAuctionItem(auctionItems);
            const auctionItemsWithNew = [...auctionItems, newItem]
            return {
                ...state,
                auctionItems: auctionItemsWithNew,
                focusedIndex: auctionItemsWithNew.indexOf(newItem)
            };
        case INPUT_CHANGE:
            const { key, value } = action;
            const origItem = selectOrigItem(state) || selectFocusedItem(state);
            const itemsWithInputChange = auctionItems.map((item, index) => {
                if (index === focusedIndex) {
                    if (key === 'minBid') {
                        const bidsWithNewMin = item.bids.map(bid =>
                            bid.name === 'min' ? { ...bid, value: parseInt(value)} : bid);
                        return { ...item, bids: bidsWithNewMin};
                    }
                    return { ...item, [key]: value};
                }
                return item;
            });
            // if (origItem) {
            //     return { ...state, dirty: true, auctionItems: itemsWithInputChange, origItem };
            // }
            return { ...state, dirty: true, missingInfo: false, auctionItems: itemsWithInputChange, origItem };
    }
}

export const selectError = (state: StoreState) => state.error;
export const selectOrigItem = (state: StoreState) => state.origItem;
export const selectIsLoaded = (state: StoreState) => state.isLoaded;
export const selectUserTotal = (state: StoreState) => state.userTotal;
export const selectMissingInfo = (state: StoreState) => state.missingInfo;
export const selectAuctionItems = (state: StoreState) => state.auctionItems;
export const selectFocusedIndex = (state: StoreState) => state.focusedIndex;
export const selectConfirmDiscard = (state: StoreState) => state.confirmDiscard;

export const selectItem = (state: StoreState, itemID: number) => selectAuctionItems(state).find(({id}) => id === itemID);
export const selectItemID = (state: StoreState, itemID: number) => selectItem(state, itemID).id;
export const selectItemBids = (state: StoreState, itemID: number) => selectItem(state, itemID).bids;
export const selectItemHighBid = (state: StoreState, itemID: number) => getHighBid(selectItem(state, itemID).bids);
export const selectLastItem = (state: StoreState) => selectAuctionItems(state).slice(-1)[0];
export const selectFirstItem = (state: StoreState) => selectAuctionItems(state)[0];
export const selectFocusedItem = (state: StoreState) => selectAuctionItems(state)[selectFocusedIndex(state)];
