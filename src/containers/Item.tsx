import * as React from 'react';
import axios from 'axios';
import { DATA_URL } from '../utils';
import { ItemView } from '../components/ItemView';
import { puts } from 'util';

// TODO: Make this configurable by auction host
export const BID_INCREMENT = 5;

type ItemProps = {
    itemData: any;
}

type Bid = {
    name: string;
    bid: number;
}

type ItemState = {
    highBid: Bid;
    highBidder?: string;
    userHasHighBid: boolean;
    userWasOutBid: boolean;
    descriptionClass: string;
}

export default class Item extends React.Component<ItemProps, ItemState> {

    constructor(props) {
        super(props);

        this.state = {
            highBid: this.getHighBid(this.props.itemData.bids),
            userHasHighBid: false,
            userWasOutBid: false,
            descriptionClass: '',
        };
    }

    getHighBid = (bids) => {
        const high = bids.reduce((high, curr) => {
            return (curr.bid > high.bid) ? curr : high;
        }, { bid: 0, name: '' });

        return high;
    }

    quickBid = (e) => {
        e.stopPropagation();
        const { bids } = this.props.itemData;
        // TODO: Don't user window.sessionStorage
        const newBid = {
            name: window.sessionStorage.userID,
            bid: this.getHighBid(bids).bid + BID_INCREMENT
        };
        bids.push(newBid);

        this.setState({ highBid: newBid });
        this.setUserBidState(newBid.name);

        this.updateData(this.props.itemData);
    }

    private updateData = (itemData): void => {
        axios.put(DATA_URL, { body: JSON.stringify(itemData) });
    }

    private setUserBidState = (highBidder: string): any => {
        const user = window.sessionStorage.userID;
        const userHasHighBid = (highBidder === user);
        const userWasOutBid = !userHasHighBid && this.props.itemData.bids.find(item => item.name === user);
        this.setState({ userHasHighBid, userWasOutBid });
    }

    // TODO: Move this to view?
    toggleDescription = (e) => {
        e.stopPropagation();
        const descriptionClass = !!this.state.descriptionClass ? '' : 'open';
        this.setState({ descriptionClass });

        // TODO: Add photos
    }

    componentWillMount() {
        this.setUserBidState(this.state.highBid.name);
    }

    componentWillReceiveProps(nextProps) {
        const highBid = this.getHighBid(nextProps.itemData.bids);
        this.setUserBidState(highBid.name);
        this.setState({ highBid });
    }

    render() {
        const { userHasHighBid, userWasOutBid, highBid, descriptionClass } = this.state;
        return <ItemView
            highBid={highBid.bid}
            userWasOutBid={userWasOutBid}
            userHasHighBid={userHasHighBid}
            quickBid={this.quickBid}
            itemData={this.props.itemData}
            toggleDescription={this.toggleDescription}
            descriptionClass={descriptionClass} />
    };
}
