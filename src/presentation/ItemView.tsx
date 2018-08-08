import * as React from 'react';
import { ItemData, Bid, BID_INCREMENT } from '../reducers/auctionItemsReducer';

type Props = {
    user: string;
    highBid: Bid;
    itemData: ItemData;
    toggleDescription: (event: any) => void;
    quickBid: (event: any) =>  void;
}

export const ItemView = ({ user, highBid, itemData, toggleDescription, quickBid }: Props) => {

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
                    <button className="bid btn" onClick={quickBid}>Bid {highBid.value + BID_INCREMENT}</button>
                </div>
            </div>
            <div className={`description ${descriptionClass} ${itemClass}`}>{itemData.description}</div>
        </div>
    );
};