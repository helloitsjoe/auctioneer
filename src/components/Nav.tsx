import * as React from 'react';

export default class Nav extends React.Component<any, any> {
    render() {
        return(
            <div className="centered nav-bg">
                <div className="nav-tab active">Auction Items</div>
                <div className="nav-tab">My Bids</div>
            </div>
        );
    }
}
