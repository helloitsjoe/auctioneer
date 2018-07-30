import * as React from 'react';
import { BID_INCREMENT } from '../containers/Item';

export const ItemView = (props: any) => {
    const {
        itemData,
        userHasHighBid,
        userWasOutBid,
        highBid,
        descriptionClass,
        toggleDescription,
        quickBid
    } = props;

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
                    <span className="high-bid">{highBid}</span>
                    <button className="bid btn" onClick={quickBid}>Bid {highBid + BID_INCREMENT}</button>
                </div>
            </div>
            <div className={`description ${descriptionClass}`}>{itemData.description}</div>
        </div>
    );
};