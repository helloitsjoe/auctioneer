import * as React from 'react';
import ConnectedItem from './Item';
import { EmptyList } from '../presentation/EmptyList';
import { ItemData } from '../reducers';

type Props = {
    user: string;
    auctionItems: ItemData[];
    filter?: boolean;
}

export const List = ({ user, auctionItems, filter }: Props) => {
    let items = auctionItems.map((item, i) => <ConnectedItem itemData={item} user={user} key={i} />);
    
    if (filter) {
        items = items.filter((itemComponent, i) => {
            return auctionItems[i].bids.some(bid => bid.name === user);
        });
    }

    return (
        <div className="list">
            <hr />
            {items.length ? items : <EmptyList />}
        </div>
    )
};