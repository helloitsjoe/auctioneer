import * as React from 'react';

export default class Item extends React.Component<any, any> {

    private bids: any[];

    constructor(props) {
        super(props);

        const { highBid, highBidder } = this.getHighBid(this.props.data.bids);
        this.state = {
            highBid,
            highBidder
        };

        this.quickBid = this.quickBid.bind(this);
        this.toggleDescription = this.toggleDescription.bind(this);

        this.bids = props.data.bids;
    }

    componentDidMount() {
        console.log(this.props.data.bids);
        if(this.state.highBidder === /*this.props.currentUser.name*/ 'user01') {
            this.styleYourBid();
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
                    <span className="bid-text" id={"bid-text"+this.props.id}>High bid:</span>
                        <button className="high-bid" id={"high-bid-"+this.props.id}>{this.state.highBid}</button>
                        <button className="bid btn" onClick={this.quickBid}>Bid {this.state.highBid + 5}</button>
                    </div>
                </div>
                <div className="description" id={"description-"+this.props.id}>{this.props.data.description}</div>
            </div>
        );
    };

    getHighBid(bids) {
        let highBid = 0;
        let highBidder = '';

        for (let j = 0; j < bids.length; j++) {
            if(bids[j].bid > highBid) {
                highBid = bids[j].bid;
                highBidder = bids[j].name;
            }
        }
        return { highBid, highBidder }
    }

    quickBid(e) {
        e.stopPropagation();
        let newBid = this.getHighBid(this.props.data.bids).highBid + 5;
        // this.bids.push(newBid);
        this.props.data.bids.push({name: 'user01', bid: newBid});
        // TODO: Is there a better place to do this, so I can get rid of this.props.id altogether?
        this.props.data.id = this.props.id;

        this.setState({ highBid: this.getHighBid(this.props.data.bids).highBid });
        this.styleYourBid();
        this.props.updateData(this.props.data/*, this.props.id*/)
    }

    styleYourBid() {
        document.getElementById('high-bid-'+this.props.id).classList.add('bid-bg');
        let yourBid = document.getElementById('bid-text'+this.props.id);
        yourBid.innerHTML = 'Your bid:';
        yourBid.classList.add('yours');
    }

    toggleDescription(e) {
        e.stopPropagation();
        let description = document.getElementById('description-'+this.props.id);
        description.classList.toggle('open');

        // TODO: Add photos
    }
}
