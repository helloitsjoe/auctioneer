import * as React from 'react';
import { connect } from 'react-redux';

import { ItemData, Bid, BID_INCREMENT } from '../reducers';
import { quickBidAction, toggleDescriptionAction } from '../actions/auctionItemActions';

type Props = {
    user: string;
    highBid: Bid;
    itemData: ItemData;
    quickBid: (e: any) => void;
    toggleDescription: (e: any) => void;
}

export function Item({ user, highBid, itemData, toggleDescription, quickBid }: Props) {

    let itemClass = '';
    let bidClass = '';
    let bidSuffix = '';

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
        <div className="item-group" onClick={toggleDescription}>
            <div className={`item-container ${itemClass}`} id={`item-${itemData.id}`}>
                <div className="item-title u-pull-left">
                    <span>{itemData.title}</span>
                </div>
                <div className="button-box u-pull-right">
                    <span className={`bid-text ${bidClass}`}>High bid {bidSuffix}</span>
                    <span className="high-bid">{highBid.value}</span>
                    <button
                        className="bid btn"
                        onClick={quickBid}
                    >
                        Bid {highBid.value + BID_INCREMENT}
                    </button>
                </div>
            </div>
            <div className={`description ${descriptionClass} ${itemClass}`}>{itemData.description}</div>
        </div>
    );
};

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
    toggleDescriptionAction,
    quickBidAction,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const itemID = ownProps.itemData.id;
    const toggleDescription = (e) => dispatchProps.toggleDescriptionAction(itemID);
    const quickBid = (e) => {
        e.stopPropagation();
        dispatchProps.quickBidAction(ownProps.user, itemID);
    };

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        toggleDescription,
        quickBid
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Item);