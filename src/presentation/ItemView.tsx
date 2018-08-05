import * as React from 'react';
import { BID_INCREMENT } from '../containers/Item';
import { ItemData, Bid } from '../containers/App';

type Props = {
    itemData: ItemData;
    userHasHighBid: boolean;
    userWasOutBid: boolean;
    highBidAmount: number;
    descriptionClass: string;
    toggleDescription: (event: any) => void;
    quickBid: (event: any) =>  void;
}

export const ItemView = ({
    itemData,
    userHasHighBid,
    userWasOutBid,
    highBidAmount,
    descriptionClass,
    toggleDescription,
    quickBid
}: Props) => {

    let itemClass = '';
    let bidClass = '';
    let bidSuffix = '';

    if (userHasHighBid) {
        itemClass = 'bid-bg';
        bidClass = 'user-high-bid';
        bidSuffix = '(You!)';
    } else if (userWasOutBid) {
        itemClass = 'outbid-bg';
        bidClass = 'user-outbid';
        bidSuffix = '(Not you!)';
    }

    return (
        <div className="item-group" onClick={toggleDescription}>
            <div className={`item-container ${itemClass}`} id={`item-${itemData.id}`}>
                <div className="item-title u-pull-left">
                    <span>{itemData.title}</span>
                </div>
                <div className="button-box u-pull-right">
                    <span className={`bid-text ${bidClass}`}>High bid {bidSuffix}</span>
                    <span className="high-bid">{highBidAmount}</span>
                    <button className="bid btn" onClick={quickBid}>Bid {highBidAmount + BID_INCREMENT}</button>
                </div>
            </div>
            <div className={`description ${descriptionClass} ${itemClass}`}>{itemData.description}</div>
        </div>
    );
};