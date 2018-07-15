import * as React from 'react';
import axios from 'axios';
import { DATA_URL } from '../utils';

type Props = {
    itemData: any;
    key: number;
    id: number;
}

type State = {
    highBid: number;
    highBidder: string;
}

// TODO: Clean up this file into container/presentation components
export default class Item extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        console.log(props);

        const { highBid, highBidder } = this.getHighBid(this.props.itemData.bids);
        this.state = {
            highBid,
            highBidder
        };

        this.quickBid = this.quickBid.bind(this);
        this.updateData = this.updateData.bind(this);
        this.toggleDescription = this.toggleDescription.bind(this);
    }

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
        let newBid = this.getHighBid(this.props.itemData.bids).highBid + 5;
        this.props.itemData.bids.push({name: 'user01', bid: newBid});
        // TODO: Is there a better place to do this, so I can get rid of this.props.id altogether?
        this.props.itemData.id = this.props.id;

        this.setState({ highBid: this.getHighBid(this.props.itemData.bids).highBid });
        this.styleYourBid();
        this.updateData();
    }

    private updateData(): void {
        console.log(this.props.itemData);
        axios.put(DATA_URL, {
            body: JSON.stringify(this.props.itemData),
        });
    }

    styleYourBid() {
        document.getElementById('high-bid-'+this.props.id).classList.add('bid-bg');
        document.getElementById('item-' + this.props.id).classList.add('bid-bg');
        let yourBid = document.getElementById('bid-text'+this.props.id);
        yourBid.innerHTML = 'High bid (You!)';
        yourBid.classList.add('yours');
    }

    toggleDescription(e) {
        e.stopPropagation();
        let description = document.getElementById('description-'+this.props.id);
        description.classList.toggle('open');

        // TODO: Add photos
    }

    componentDidMount() {
        console.log(this.props.itemData.bids);
        if(this.state.highBidder === /*this.props.currentUser.name*/ 'user01') {
            this.styleYourBid();
        }
    }

    render() {
        return (
            <div className="item-group clearfix" onClick={this.toggleDescription}>
                <div className="item-container" id={"item-" + this.props.id}>
                    <div className="item-title u-pull-left">
                        <span>{this.props.itemData.title}</span>
                    </div>
                    <div className="button-box u-pull-right">
                    <span className="bid-text" id={"bid-text"+this.props.id}>High bid:</span>
                        <span className="high-bid" id={"high-bid-"+this.props.id}>{this.state.highBid}</span>
                        <button className="bid btn" onClick={this.quickBid}>Bid {this.state.highBid + 5}</button>
                    </div>
                </div>
                <div className="description" id={"description-"+this.props.id}>{this.props.itemData.description}</div>
            </div>
        );
    };
}
