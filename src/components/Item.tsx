import * as React from 'react';
import axios from 'axios';
import { DATA_URL } from '../utils';

type Props = {
    itemData: any;
}

type State = {
    highBid: number;
    highBidder: string;
    itemClass: string;
    bidClass: string;
    bidText: string;
    descriptionClass: string;
}

// TODO: Refactor this file into container/presentation components
export default class Item extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        const { highBid, highBidder } = this.getHighBid(this.props.itemData.bids);
        this.state = {
            highBid,
            highBidder,
            bidClass: '',
            bidText: 'High bid:',
            itemClass: '',
            descriptionClass: '',
        };

        this.quickBid = this.quickBid.bind(this);
        this.styleItem = this.styleItem.bind(this);
        this.updateData = this.updateData.bind(this);
        this.getHighBid = this.getHighBid.bind(this);
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
        const itemData = this.props.itemData;
        let newBid = this.getHighBid(this.props.itemData.bids).highBid + 5;
        // TODO: Don't user window.sessionStorage
        itemData.bids.push({ name: window.sessionStorage.userID, bid: newBid });
        const { highBid, highBidder } = this.getHighBid(itemData.bids);

        this.setState({ highBid, highBidder });
        this.styleItem(highBidder);
        this.updateData();
    }

    private updateData(): void {
        const body = JSON.stringify(this.props.itemData);
        axios.put(DATA_URL, { body });
    }

    private styleItem(highBidder: string): void {
        const user = window.sessionStorage.userID;
        if (highBidder === user) {
            this.setState({
                itemClass: 'bid-bg',
                bidClass: 'user-high-bid',
                bidText: 'High bid (You!)',
            });
        } else if (this.props.itemData.bids.find(item => item.name === user)) {
            this.setState({
                itemClass: 'outbid-bg',
                bidClass: 'user-outbid',
                bidText: 'High bid (Not you!)',
            });
        }
    }

    toggleDescription(e) {
        e.stopPropagation();
        const descriptionClass = !!this.state.descriptionClass ? '' : 'open';
        this.setState({ descriptionClass });

        // TODO: Add photos
    }

    componentDidMount() {
        this.styleItem(this.state.highBidder);
    }

    render() {
        const { itemClass, bidClass, highBid, descriptionClass, bidText } = this.state;
        const { itemData } = this.props;
        return (
            <div className="item-group" onClick={this.toggleDescription}>
                <div className={`item-container ${itemClass}`} id={`item-${itemData.id}`}>
                    <div className="item-title u-pull-left">
                        <span>{itemData.title}</span>
                    </div>
                    <div className="button-box u-pull-right">
                        <span className={`bid-text ${bidClass}`}>{bidText}</span>
                        <span className="high-bid">{highBid}</span>
                        <button className="bid btn" onClick={this.quickBid}>Bid {highBid + 5}</button>
                    </div>
                </div>
                <div className={`description ${descriptionClass}`}>{itemData.description}</div>
            </div>
        );
    };
}
