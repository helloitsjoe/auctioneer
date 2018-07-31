import * as React from 'react';
import Item from './Item';
import { EmptyList } from '../components/EmptyList';

type Props = {
    auctionData: any[];
    filter?: boolean;
}

export const List = (props: Props) => {
    const userID = window.sessionStorage.userID;
    const items = props.auctionData.map((itemData, i) => {
        const userBidOnItem = itemData.bids.find(bid => bid.name === userID);
        if (props.filter) {
            return userBidOnItem && <Item itemData={itemData} key={i} />
        } else {
            return <Item itemData={itemData} key={i} />;
        }
    }).filter(Boolean);

    return (
        <div className="list">
            <hr />
            {items.length ? items : <EmptyList />}
        </div>
    )
};
