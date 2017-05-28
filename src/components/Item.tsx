import * as React from 'react';
// import data from '../data';

export default class Item extends React.Component<any, any> {
    private bids:any[];

    constructor(props) {
        super();
        this.quickBid = this.quickBid.bind(this);
        this.toggleDescription = this.toggleDescription.bind(this);
        this.bids = props.bids;
        this.state = {
            highBid: this.getHighBid()
        }
    }

    render() {
        return (

            <div className="item-group clearfix" onClick={this.toggleDescription}>
                <div className="item-container">
                    <div className="item-title u-pull-left">
                        <span>{this.props.title}</span>
                    </div>
                    <div className="button-box u-pull-right">
                    <span className="your-bid hidden" id={"your-bid-text"+this.props.id}>Your bid:</span>
                        <button className="btn" id={"your-bid-"+this.props.id}>{this.state.highBid}</button>
                        <button className="bid btn" onClick={this.quickBid}>Bid +$5</button>
                    </div>
                </div>
                <div className="description" id={"description-"+this.props.id}>{this.props.description}</div>
            </div>
        );
    };

    getHighBid() {
        return Math.max.apply(null, this.bids);
    }

    quickBid(e) {
        e.stopPropagation();
        this.bids.push(this.getHighBid() + 5);
        this.setState({ highBid: this.getHighBid() });
        document.getElementById("your-bid-text"+this.props.id).classList.remove('hidden');
        document.getElementById('your-bid-'+this.props.id).classList.add('bid-bg');
        // TODO: Update DB
    }

    toggleDescription(e) {
        e.stopPropagation();
        document.getElementById('description-'+this.props.id).classList.toggle('open');
        // TODO: Add photos
    }
}
