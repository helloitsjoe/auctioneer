import * as React from 'react';
import axios from 'axios';
import { DATA_URL } from '../utils';
import { ItemView } from '../components/ItemView';

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

        const highBid = this.getHighBid(this.props.itemData.bids);
        this.state = {
            highBid,
            userHasHighBid: false,
            userWasOutBid: false,
            descriptionClass: '',
        };
    }

    getHighBid = (bids) => {
        const high = bids.reduce((high, curr) => {
            return (curr.bid > high.bid) ? curr : high;
        }, { bid: 0, name: '' });

        // return { highBid: high.bid, highBidder: high.name }
        return high;
    }

    quickBid = (e) => {
        e.stopPropagation();
        const itemData = this.props.itemData;
        let newBid = this.getHighBid(this.props.itemData.bids).bid + 5;
        // TODO: Don't user window.sessionStorage
        itemData.bids.push({ name: window.sessionStorage.userID, bid: newBid });

        const highBid = this.getHighBid(itemData.bids);
        this.setState({ highBid });
        this.setUserBidState(highBid.name);

        this.updateData();
    }

    private updateData = (): void => {
        axios.put(DATA_URL, { body: JSON.stringify(this.props.itemData) });
    }

    private setUserBidState = (highBidder: string): any => {
        const user = window.sessionStorage.userID;
        const userHasHighBid = (highBidder === user);
        const userWasOutBid = !userHasHighBid && this.props.itemData.bids.find(item => item.name === user);
        this.setState({ userHasHighBid, userWasOutBid });
    }

    toggleDescription = (e) => {
        e.stopPropagation();
        const descriptionClass = !!this.state.descriptionClass ? '' : 'open';
        this.setState({ descriptionClass });

        // TODO: Add photos
    }

    componentWillMount() {
        this.setUserBidState(this.state.highBidder);
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
