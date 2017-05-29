import * as React from 'react';

export default class Item extends React.Component<any, any> {
    private bids:any[];

    constructor(props) {
        super();

        this.quickBid = this.quickBid.bind(this);
        this.toggleDescription = this.toggleDescription.bind(this);

        this.bids = [];
        for (let j = 0; j < props.data.bids.length; j++) {
            this.bids.push(props.data.bids[j].bid);
        }

        this.state = {
            highBid: this.getHighBid()
        }
    }

    render() {
        return (
            <div className="item-group clearfix" onClick={this.toggleDescription}>
                <div className="item-container">
                    <div className="item-title u-pull-left">
                        <span>{this.props.data.title}</span>
                    </div>
                    <div className="button-box u-pull-right">
                    <span className="high-bid" id={"your-bid-text"+this.props.id}>High bid:</span>
                        <button className="btn" id={"your-bid-"+this.props.id}>{this.state.highBid}</button>
                        <button className="bid btn" onClick={this.quickBid}>Bid {this.state.highBid + 5}</button>
                    </div>
                </div>
                <div className="description" id={"description-"+this.props.id}>{this.props.data.description}</div>
            </div>
        );
    };

    getHighBid() {
        return Math.max.apply(null, this.bids);
    }

    quickBid(e) {
        e.stopPropagation();
        let newBid = this.getHighBid() + 5;
        this.bids.push(newBid);
        this.props.data.bids.push({name: 'user01', bid: newBid})
        this.setState({ highBid: this.getHighBid() });

        document.getElementById('your-bid-'+this.props.id).classList.add('bid-bg');
        let yourBid = document.getElementById('your-bid-text'+this.props.id);
        yourBid.innerHTML = 'Your bid:';
        yourBid.classList.add('yours');
        this.props.updateData(this.props.data, this.props.id)
        // TODO: Update DB
    }

    toggleDescription(e) {
        e.stopPropagation();
        let description = document.getElementById('description-'+this.props.id);
        description.classList.toggle('open');

        // TODO: Add photos
    }
}
