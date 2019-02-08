import { getHighBid, createNewAuctionItem, getUserTotal } from './utils';

export type AuctionItem = {
    id: number;
    bids: Bid[];
    title: string;
    // photos: any[];
    description: string;
    viewDetails: boolean;
};

export type Bid = {
    name: string;
    value: number;
};

export type StoreState = {
    error: Error;
    isLoaded: boolean;
    auctionItems: AuctionItem[];
    userTotal: number;
};

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
export const DELETE_ITEM_ERROR = 'DELETE_ITEM_ERROR';
export const SUBMIT_CHANGE_SUCCESS = 'SUBMIT_CHANGE_SUCCESS';
export const SUBMIT_CHANGE_ERROR = 'SUBMIT_CHANGE_ERROR';

const initialState: StoreState = {
    error: null,
    isLoaded: false,
    auctionItems: [],
    userTotal: 0,
};

export const auctionReducer = (state = initialState, action): StoreState => {
    switch (action.type) {
        case FETCH_AUCTION_SUCCESS:
            const { rawAuctionItems } = action;
            const auctionItems: AuctionItem[] = rawAuctionItems.length
                ? rawAuctionItems.map(item => {
                      // Need to set viewDetails state on client side
                      const itemInState = selectItem(state, item.id);
                      const viewDetails = !!(
                          itemInState && itemInState.viewDetails
                      );
                      return { ...item, viewDetails };
                  })
                : [createNewAuctionItem()];
            const userTotal = getUserTotal(auctionItems, action.userName);
            return { ...state, auctionItems, userTotal, isLoaded: true };
        case FETCH_AUCTION_ERROR:
            return { ...state, error: action.err, isLoaded: true };
        case DELETE_ITEM_SUCCESS:
        case SUBMIT_CHANGE_SUCCESS:
        case TOGGLE_DESCRIPTION:
        case QUICK_BID:
            const updatedItems = updateItems(selectAuctionItems(state), action);
            return {
                ...state,
                auctionItems: updatedItems,
                userTotal: getUserTotal(updatedItems, action.userName),
            };
        default:
            return state;
    }
};

const updateItems = (
    auctionItems: AuctionItem[],
    action: any
): AuctionItem[] => {
    const { userName: name, itemID, type } = action;

    const item = itemID != null && auctionItems.find(({ id }) => id === itemID);

    if (!item && (type === QUICK_BID || type === TOGGLE_DESCRIPTION)) {
        console.error('Item not found in auctionItems!');
        return auctionItems;
    }

    switch (action.type) {
        case QUICK_BID:
            const value = getHighBid(item.bids).value + BID_INCREMENT;
            const bids = [...item.bids, { name, value }];
            return auctionItems.map(
                item => (item.id === itemID ? { ...item, bids } : item)
            );
        case TOGGLE_DESCRIPTION:
            const viewDetails = !item.viewDetails;
            return auctionItems.map(
                item => (item.id === itemID ? { ...item, viewDetails } : item)
            );
        case DELETE_ITEM_SUCCESS:
            const { deletedItemID } = action;
            const itemsAfterDelete = auctionItems.filter(
                item => item.id !== deletedItemID
            );
            return itemsAfterDelete.length
                ? itemsAfterDelete
                : [createNewAuctionItem()];
        case SUBMIT_CHANGE_SUCCESS:
            const { updatedItem } = action;
            return auctionItems.map(
                item => (item.id === updatedItem.id ? updatedItem : item)
            );
    }
};

export const selectError = (state: StoreState) => state.error;
export const selectIsLoaded = (state: StoreState) => state.isLoaded;
export const selectUserTotal = (state: StoreState) => state.userTotal;
export const selectAuctionItems = (state: StoreState) => state.auctionItems;

export const selectItem = (state: StoreState, itemID: number) =>
    selectAuctionItems(state).find(({ id }) => id === itemID);
export const selectFirstItem = (state: StoreState) =>
    selectAuctionItems(state)[0];
