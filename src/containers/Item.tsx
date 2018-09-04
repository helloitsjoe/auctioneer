import * as React from 'react';
import { connect } from 'react-redux';

import { getHighBid } from '../utils';
import { ItemView } from '../presentation/ItemView';
import { quickBidAction, toggleDescriptionAction } from '../actions/auctionItemActions';
import { putRequest } from '../actions/adminActions';
import { ItemData } from '../reducers';

type Props = {
    itemData: any;
    user: string;
    incrementTotal: () => void;
    quickBidAction: (user: string, id: number) => void;
    putRequest: (itemData: ItemData) => void;
    toggleDescriptionAction: (id: number) => void;
}

export function Item({ itemData, user, incrementTotal, quickBidAction, putRequest, toggleDescriptionAction }: Props) {

    const quickBid = (e) => {
        e.stopPropagation();
        // console.log(`userTotal:`, userTotal);
        incrementTotal();
        quickBidAction(user, itemData.id);
        putRequest(itemData);
    }

    const toggleDescription = (e) => {
        toggleDescriptionAction(itemData.id)
        // TODO: Add photos
    }

    return (
        <ItemView
            user={user}
            highBid={getHighBid(itemData.bids)}
            itemData={itemData}
            quickBid={quickBid}
            toggleDescription={toggleDescription}
        />
    )
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
    toggleDescriptionAction: (id) => dispatch(toggleDescriptionAction(id)),
    quickBidAction: (user, id) => dispatch(quickBidAction(user, id)),
    putRequest: (itemData) => dispatch(putRequest(itemData)),
})

// Note: Need named default export for tests to
// render Connect(Item) instead of Connect(Component)
const ConnectedItem = connect(mapStateToProps, mapDispatchToProps)(Item);
export default ConnectedItem;