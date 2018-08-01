import * as React from 'react';
import { Item } from './Item';
import { EmptyList } from '../components/EmptyList';

type Props = {
    user: string;
    auctionData: any[];
    filter?: boolean;
}

export const List = (props: Props) => {
    const items = props.auctionData.map((itemData, i) => {
        const userBidOnItem = itemData.bids.find(bid => bid.name === props.user);
        if (props.filter) {
            return userBidOnItem && <Item itemData={itemData} user={props.user} key={i} />
        } else {
            return <Item itemData={itemData} user={props.user} key={i} />;
        }
    }).filter(Boolean);

    return (
        <div className="list">
            <hr />
            {items.length ? items : <EmptyList />}
        </div>
    )
};
