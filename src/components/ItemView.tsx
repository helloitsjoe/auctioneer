import * as React from 'react';


// TODO: Refactor this file into container/presentation components
export const ItemView = (props: any) => {
    const {
        itemData,
        itemClass,
        bidClass,
        bidText,
        highBid,
        descriptionClass,
        toggleDescription,
        quickBid
    } = props;

    return (
        <div className="item-group" onClick={toggleDescription}>
            <div className={`item-container ${itemClass}`} id={`item-${itemData.id}`}>
                <div className="item-title u-pull-left">
                    <span>{itemData.title}</span>
                </div>
                <div className="button-box u-pull-right">
                    <span className={`bid-text ${bidClass}`}>{bidText}</span>
                    <span className="high-bid">{highBid}</span>
                    <button className="bid btn" onClick={quickBid}>Bid {highBid + 5}</button>
                </div>
            </div>
            <div className={`description ${descriptionClass}`}>{itemData.description}</div>
        </div>
    );
};