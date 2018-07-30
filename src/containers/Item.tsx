import * as React from 'react';
import axios from 'axios';
import { DATA_URL } from '../utils';
import { ItemView } from '../components/ItemView';

type ItemProps = {
    itemData: any;
}

type ItemState = ItemStyle & {
    highBid: number;
    highBidder?: string;
    descriptionClass: string;
}

type ItemStyle = {
    itemClass: string;
    bidClass: string;
    bidText: string;
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
        const high = bids.reduce((high, curr) => {
            return curr.bid > high.bid ? curr : high;
        }, { bid: 0, name: '' });

        return { highBid: high.bid, highBidder: high.name }
    }

    quickBid = (e) => {
        e.stopPropagation();
        const itemData = this.props.itemData;
        let newBid = this.getHighBid(this.props.itemData.bids).highBid + 5;
        // TODO: Don't user window.sessionStorage
        itemData.bids.push({ name: window.sessionStorage.userID, bid: newBid });
        const { highBid, highBidder } = this.getHighBid(itemData.bids);
        const { itemClass, bidClass, bidText } = this.getStyleInfo(highBidder);

        this.setState({ highBid, highBidder, itemClass, bidClass, bidText });
        this.updateData();
    }

    private updateData = (): void => {
        axios.put(DATA_URL, { body: JSON.stringify(this.props.itemData) });
    }

    private getStyleInfo = (highBidder: string): any => {
        const user = window.sessionStorage.userID;
        if (highBidder === user) {
            return {
                itemClass: 'bid-bg',
                bidClass: 'user-high-bid',
                bidText: 'High bid (You!)',
            }
        } else if (this.props.itemData.bids.find(item => item.name === user)) {
            return {
                itemClass: 'outbid-bg',
                bidClass: 'user-outbid',
                bidText: 'High bid (Not you!)',
            }
        }
        // User hasn't bid on this Item
        return null;
    }

    toggleDescription = (e) => {
        e.stopPropagation();
        const descriptionClass = !!this.state.descriptionClass ? '' : 'open';
        this.setState({ descriptionClass });

        // TODO: Add photos
    }

    componentWillMount() {
        const styleInfo = this.getStyleInfo(this.state.highBidder);
        if (styleInfo) {
            const { itemClass, bidClass, bidText } = styleInfo;
            this.setState({ itemClass, bidClass, bidText });
        }
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
