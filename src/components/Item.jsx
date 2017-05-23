import * as React from 'react';

export class Item extends React.Component {
    render() {
        return (
            <div>
                // Title (pull left)
                // Button Box (pull right)
                    // Current Price - value from state
                    // Bid button
                        // Label: Current price + $5? $10? Just '$5 more'?
                        // Two buttons? '+$5' and 'Custom bid'?
            </div>
        );
    };

    handleClick() {
        // If tap on title, open up description/photos
        // If tap on $5 button, update current bid on DB and in view
    }
}
