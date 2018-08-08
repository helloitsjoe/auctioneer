import axios from 'axios';
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { DATA_URL } from '../utils';
import { ItemView } from '../presentation/ItemView';
import { getHighBid } from '../reducers/auctionItemsReducer';
import { quickBidAction, toggleDescriptionAction } from '../actions/auctionItemActions';

type Props = {
    itemData: any;
    user: string;
    dispatch: Dispatch;
}

export function Item({ itemData, user, dispatch }: Props) {

    const quickBid = (e) => {
        e.stopPropagation();

        dispatch(quickBidAction(user, itemData.id));
        axios.put(DATA_URL, { body: JSON.stringify(itemData) });
    }

    const toggleDescription = (e) => {
        dispatch(toggleDescriptionAction(itemData.id))
        // TODO: Add photos
    }

    return <ItemView
        user={user}
        highBid={getHighBid(itemData.bids)}
        itemData={itemData}
        quickBid={quickBid}
        toggleDescription={toggleDescription} />
}

const mapStateToProps = (state) => state;

// Note: Need named default export for tests to
// render Connect(Item) instead of Connect(Component)
const ConnectedItem = connect(mapStateToProps)(Item);
export default ConnectedItem;