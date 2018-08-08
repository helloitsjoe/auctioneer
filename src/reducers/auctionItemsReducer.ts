import { SET_AUCTION_DATA, SET_AUCTION_ERROR, QUICK_BID, TOGGLE_DESCRIPTION } from '../actions/actionTypes';

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

const app = {
    error: null,
    isLoaded: false,
    auctionItems: null
}

const initialState = Object.assign({}, app);

export const getHighBid = (bids: Bid[]): Bid => {
    return bids.reduce((high, curr) => {
        return (curr.value > high.value) ? curr : high;
    }, { value: 0, name: '' });
}

export const getMinBidValue = (bids: Bid[]) => {
    const minBid = bids.find(bid => bid.name === 'min');
    return minBid ? minBid.value : 0;
}

export const createNewAuctionItem = ({ id }): ItemData => ({
    id,
    title: '',
    bids: [{ name: 'min', value: 0 }],
    description: '',
    viewDetails: false
});

export const auctionItems = (state=initialState, action) => {
    console.log(`action:`, action);
    switch (action.type) {
        case SET_AUCTION_DATA:
            const auctionItems = action.rawAuctionItems.map((item, i) => {
                // I don't love having viewDetails as an added property on each item...
                const viewDetails = state.auctionItems ? state.auctionItems[i].viewDetails : false;
                return Object.assign({}, item, { id: i, viewDetails });
            });
            return Object.assign({}, state, { auctionItems, isLoaded: true });
        case SET_AUCTION_ERROR:
            return Object.assign({}, state, { error: action.err, isLoaded: true });
        case QUICK_BID:
            // TODO: QUICK_BID and TOGGLE_DESCRIPTION feel a little ugly. Fix em up.
            const { userName, itemID } = action;
            const items = [...state.auctionItems];
            const item = items[itemID];
            const newHighBid = getHighBid(item.bids).value + BID_INCREMENT;
            item.bids.push({ name: userName, value: newHighBid });
            return Object.assign({}, state, { auctionItems: items });
        case TOGGLE_DESCRIPTION:
            const itemsCopy = [...state.auctionItems];
            const itemCopy = itemsCopy[action.itemID];
            itemCopy.viewDetails = !itemCopy.viewDetails;
            return Object.assign({}, state, { auctionItems: itemsCopy });
        default:
            return state;
    }
}