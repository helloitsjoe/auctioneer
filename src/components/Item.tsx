import * as React from 'react';
import data from '../data';

export default class Item extends React.Component<any, any> {
    render() {
        return (
            <div className="item-container">
                <div className="item-title u-pull-left">
                    <span>Title</span>
                </div>
                <div className="button-box u-pull-right">
                    <button>Current Price</button>
                    <button>Bid></button>
                </div>
            </div>
            // Title (pull left)
            // Button Box (pull right)
            // Current Price - value from state
            // Bid button
            // Label: Current price + $5? $10? Just '$5 more'?
            // Two buttons? '+$5' and 'Custom bid'?
        );
    };

    handleClick() {
        // If tap on title, open up description/photos
        // If tap on $5 button, update current bid on DB and in view
    }
}
