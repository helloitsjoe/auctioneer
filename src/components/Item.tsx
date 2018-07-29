import * as React from 'react';
import axios from 'axios';
import { DATA_URL } from '../utils';
import { ItemView } from './ItemView';

export type ItemProps = {
    itemData: any;
}

export type ItemState = {
    highBid: number;
    highBidder?: string;
    itemClass: string;
    bidClass: string;
    bidText: string;
    descriptionClass: string;
}

// TODO: Refactor this file into container/presentation components
export default class Item extends React.Component<ItemProps, ItemState> {

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
    }

    getHighBid = (bids) => {
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

    quickBid = (e) => {
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

    private updateData = (): void => {
        axios.put(DATA_URL, { body: JSON.stringify(this.props.itemData) });
    }

    private styleItem = (highBidder: string): void => {
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

    toggleDescription = (e) => {
        e.stopPropagation();
        const descriptionClass = !!this.state.descriptionClass ? '' : 'open';
        this.setState({ descriptionClass });

        // TODO: Add photos
    }

    componentWillMount() {
        this.styleItem(this.state.highBidder);
    }

    render() {
        const { itemClass, bidClass, bidText, highBid, descriptionClass } = this.state;
        return <ItemView
            itemData={this.props.itemData}
            itemClass={itemClass}
            bidClass={bidClass}
            bidText={bidText}
            highBid={highBid}
            toggleDescription={this.toggleDescription}
            quickBid={this.quickBid}
            descriptionClass={descriptionClass} />
    };
}
