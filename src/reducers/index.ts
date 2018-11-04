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

export type StoreState = {
    error: Error;
    isLoaded: boolean;
    auctionItems: ItemData[];
    selectedIndex: number;
    userTotal: number;
}

// TODO: Make this configurable by auction host
export const BID_INCREMENT = 5;

export const SET_AUCTION_DATA = 'SET_AUCTION_DATA';
export const SET_AUCTION_ERROR = 'SET_AUCTION_ERROR';

export const QUICK_BID = 'QUICK_BID';
export const TOGGLE_DESCRIPTION = 'TOGGLE_DESCRIPTION';

export const ADD_ITEM = 'ADD_ITEM';
export const ITEM_FOCUSED = 'ITEM_FOCUSED';
export const DELETE_ITEM_SUCCESS = 'DELETE_ITEM_SUCCESS';
export const INPUT_CHANGE = 'INPUT_CHANGE';

const initialState: StoreState = {
    error: null,
    isLoaded: false,
    auctionItems: [],
    selectedIndex: 0,
    userTotal: 0,
}

export const auctionItems = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUCTION_DATA:
            const { rawAuctionItems } = action;
            const auctionItems = rawAuctionItems.length ? rawAuctionItems.map((item) => {
                // Is there a better way to do this?
                const itemInState = selectItem(state, item.id)
                const viewDetails = !!(itemInState && itemInState.viewDetails);
                return {...item, viewDetails};
            }) : [createNewAuctionItem()];
            const userTotalMaybeOutbid = getUserTotal(auctionItems, action.userName);
            return {...state, auctionItems, userTotal: userTotalMaybeOutbid, isLoaded: true };
        case SET_AUCTION_ERROR:
            return { ...state, error: action.err, isLoaded: true };
        case ITEM_FOCUSED:
            return { ...state, selectedIndex: action.itemIndex };
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

const item = (state: StoreState, action: any) => {
    const { userName, itemID } = action;
    const { selectedIndex, auctionItems } = state;

    const item = (itemID != null) && selectItem(state, itemID);
    switch (action.type) {
        case QUICK_BID:
            if (!item) {
                console.error('Item not found in auctionItems!');
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
            const newSelectedIndex = selectedIndex >= safeItemsAfterDelete.length ? safeItemsAfterDelete.length - 1 : selectedIndex;
            return {
                ...state,
                auctionItems: safeItemsAfterDelete,
                selectedIndex: newSelectedIndex
            };
        case ADD_ITEM:
            const newItem = createNewAuctionItem(auctionItems);
            const auctionItemsWithNew = [...auctionItems, newItem]
            return {
                ...state,
                auctionItems: auctionItemsWithNew,
                selectedIndex: auctionItemsWithNew.indexOf(newItem)
            };
        case INPUT_CHANGE:
            const { key, value } = action;
            const itemsWithInputChange = auctionItems.map((item, index) => {
                if (index === selectedIndex) {
                    if (key === 'minBid') {
                        const bidsWithNewMin = item.bids.map(bid =>
                            bid.name === 'min' ? { ...bid, value: parseInt(value)} : bid);
                        return { ...item, bids: bidsWithNewMin};
                    }
                    return { ...item, [key]: value};
                }
                return item;
            })
            return { ...state, auctionItems: itemsWithInputChange };
    }
}

export const selectError = state => state.error;
export const selectIsLoaded = state => state.isLoaded;
export const selectUserTotal = state => state.userTotal;

export const selectAuctionItems = state => state.auctionItems;
export const selectSelectedIndex = state => state.selectedIndex;
export const selectItem = (state, itemID) => selectAuctionItems(state).find(({id}) => id === itemID);
export const selectItemBids = (state, itemID) => selectItem(state, itemID).bids;
export const selectItemHighBid = (state, itemID) => getHighBid(selectItem(state, itemID).bids);
export const selectItemID = (state, itemID) => selectItem(state, itemID).id;
