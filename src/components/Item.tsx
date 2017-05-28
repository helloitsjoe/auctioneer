import * as React from 'react';
// import data from '../data';

export default class Item extends React.Component<any, any> {
    private bids:any[];

    constructor(props) {
        super();
        this.quickBid = this.quickBid.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.bids = props.bids;
        this.state = {
            highBid: this.getHighBid()
        }
    }

    render() {
        return (
            <div className="item-group clearfix" onClick={this.handleClick}>
                <div className="item-container">
                    <div className="item-title u-pull-left">
                        <span>{this.props.title}</span>
                    </div>
                    <div className="button-box u-pull-right">
                    <span className="your-bid hidden" id={this.props.id}>Your bid:</span>
                        <button className="btn" id={"your-bid-"+this.props.id}>{this.state.highBid}</button>
                        <button className="bid btn" onClick={this.quickBid}>Bid +$5</button>
                    </div>
                </div>
                <div className="description" id={"description-"+this.props.id}>{this.props.description}</div>
            </div>
            // Title (pull left)
            // Button Box (pull right)
            // Current Price - value from state
            // Bid button
            // Label: Current price + $5? $10? Just '$5 more'?
            // Two buttons? '+$5' and 'Custom bid'?
        );
    };

    getHighBid() {
        return Math.max.apply(null, this.bids);
    }

    quickBid(e) {
        e.stopPropagation();
        this.bids.push(this.getHighBid() + 5);
        this.setState({ highBid: this.getHighBid() });
        document.getElementById(this.props.id).classList.remove('hidden');
        document.getElementById('your-bid-'+this.props.id).classList.add('bid-bg');
        // TODO: Update DB
    }

    handleClick(e) {
        e.stopPropagation();
        console.log(this.props.description)
        document.getElementById('description-'+this.props.id).classList.toggle('open');
        // If tap on title, open up description/photos
    }
}
