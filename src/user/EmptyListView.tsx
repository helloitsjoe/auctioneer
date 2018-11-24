import * as React from 'react';

export function EmptyList({}) {
    return (
        <div className="item-group clearfix">
            <div className="item-container">
                <span>No bids yet!</span>
            </div>
        </div>
    )
}