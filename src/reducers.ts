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
export const TOGGLE_DESCRIPTION = 'TOGGLE_DESCRIPTION';

export const DELETE_ITEM_SUCCESS = 'DELETE_ITEM_SUCCESS';
export const SUBMIT_CHANGE_SUCCESS = 'SUBMIT_CHANGE_SUCCESS';

const initialState: StoreState = {
    error: null,
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
        case QUICK_BID:
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
    const { auctionItems } = state;

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
            return {
                ...state,
                auctionItems: safeItemsAfterDelete,
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
    }
}

export const selectError = (state: StoreState) => state.error;
export const selectIsLoaded = (state: StoreState) => state.isLoaded;
export const selectUserTotal = (state: StoreState) => state.userTotal;
export const selectAuctionItems = (state: StoreState) => state.auctionItems;

export const selectItem = (state: StoreState, itemID: number) => selectAuctionItems(state).find(({id}) => id === itemID);
export const selectItemID = (state: StoreState, itemID: number) => selectItem(state, itemID).id;
export const selectItemBids = (state: StoreState, itemID: number) => selectItem(state, itemID).bids;
export const selectItemHighBid = (state: StoreState, itemID: number) => getHighBid(selectItem(state, itemID).bids);
export const selectLastItem = (state: StoreState) => selectAuctionItems(state).slice(-1)[0];
export const selectFirstItem = (state: StoreState) => selectAuctionItems(state)[0];
