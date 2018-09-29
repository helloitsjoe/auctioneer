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
    quickBidAction: (user: string, id: number) => void;
    putRequest: (itemData: ItemData) => void;
    toggleDescriptionAction: (id: number) => void;
}

export function Item({ itemData, user, quickBidAction, putRequest, toggleDescriptionAction }: Props) {

    const quickBid = (e) => {
        e.stopPropagation();

        quickBidAction(user, itemData.id);
        putRequest(itemData);
    }

    const toggleDescription = (e) => {
        toggleDescriptionAction(itemData.id)
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

const mapDispatchToProps = {
    toggleDescriptionAction,
    quickBidAction,
    putRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(Item);