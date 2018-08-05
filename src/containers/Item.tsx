import * as React from 'react';
import axios from 'axios';
import { DATA_URL, getHighBid } from '../utils';
import { ItemView } from '../presentation/ItemView';
import { Bid } from '../containers/App';

// TODO: Make this configurable by auction host
export const BID_INCREMENT = 5;

type Props = {
    itemData: any;
    user: string;
}

type State = {
    highBid: Bid;
    highBidder?: string;
    userHasHighBid: boolean;
    userWasOutBid: boolean;
    descriptionClass: string;
}

export class Item extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            highBid: getHighBid(this.props.itemData.bids),
            userHasHighBid: false,
            userWasOutBid: false,
            descriptionClass: 'closed',
        };
    }

    quickBid = (e) => {
        e.stopPropagation();
        const { bids } = this.props.itemData;
        const newBid = {
            name: this.props.user,
            value: this.state.highBid.value + BID_INCREMENT
        };
        bids.push(newBid);

        this.setState({ highBid: newBid });

        this.updateData(this.props.itemData);
    }

    private updateData = (itemData): void => {
        axios.put(DATA_URL, { body: JSON.stringify(itemData) });
    }

    // TODO: Move this to view?
    toggleDescription = (e) => {
        e.stopPropagation();
        const descriptionClass = this.state.descriptionClass === 'open' ? 'closed' : 'open';
        this.setState({ descriptionClass });

        // TODO: Add photos
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return { highBid: getHighBid(nextProps.itemData.bids) };
    }

    render() {
        const { highBid, descriptionClass } = this.state;
        const { itemData, user } = this.props;

        const userHasHighBid = (highBid.name === user);
        const userWasOutBid = !userHasHighBid && itemData.bids.find(item => item.name === user);

        return <ItemView
            highBidAmount={highBid.value}
            userWasOutBid={userWasOutBid}
            userHasHighBid={userHasHighBid}
            quickBid={this.quickBid}
            itemData={itemData}
            toggleDescription={this.toggleDescription}
            descriptionClass={descriptionClass} />
    };
}
