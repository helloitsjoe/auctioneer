import * as React from 'react';
import { connect } from 'react-redux';

import { ItemData, Bid, BID_INCREMENT } from '../reducers';
import { quickBid, toggleDescription } from '../actions/auctionItemActions';

type Props = {
    user: string;
    highBid: Bid;
    itemData: ItemData;
    onQuickBid: (e: any) => void;
    onToggleDescription: (e: any) => void;
}

export function Item({ user, highBid, itemData, onToggleDescription, onQuickBid }: Props) {

    let itemClass = '';
    let bidClass = '';
    let bidSuffix = '';
// TODO: Pass this in as a prop
    if (highBid.name === user) {
        itemClass = 'bid-bg';
        bidClass = 'user-high-bid';
        bidSuffix = '(You!)';
    } else if (itemData.bids.some(bid => bid.name === user)) {
        itemClass = 'outbid-bg';
        bidClass = 'user-outbid';
        bidSuffix = '(Not you!)';
    }

    const descriptionClass = itemData.viewDetails ? 'open' : 'closed';

    return (
        <div className="item-group" onClick={onToggleDescription}>
            <div className={`item-container ${itemClass}`} id={`item-${itemData.id}`}>
                <div className="item-title u-pull-left">
                    <span>{itemData.title}</span>
                </div>
                <div className="button-box u-pull-right">
                    <span className={`bid-text ${bidClass}`}>High bid {bidSuffix}</span>
                    <span className="high-bid">{highBid.value}</span>
                    <button
                        className="bid btn"
                        onClick={onQuickBid}
                    >
                        Bid {highBid.value + BID_INCREMENT}
                    </button>
                </div>
            </div>
            <div
                className={`description ${descriptionClass} ${itemClass}`}
            >{itemData.description}</div>
        </div>
    );
};

const mapDispatchToProps = {
    toggleDescription,
    quickBid,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const itemID = ownProps.itemData.id;
    const toggleDescription = (e) => dispatchProps.toggleDescription(itemID);
    const quickBid = (e) => {
        e.stopPropagation();
        dispatchProps.quickBid(ownProps.user, itemID);
    };

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        onToggleDescription: toggleDescription,
        onQuickBid: quickBid,
    }
};

export default connect(null, mapDispatchToProps, mergeProps)(Item);