import * as React from 'react';
import ConnectedItem from './Item';
import { EmptyList } from './EmptyListView';
import { ItemData } from '../reducers';
import { getHighBid } from '../utils';

type Props = {
    user: string;
    auctionItems: ItemData[];
    filter?: boolean;
}

export const List = ({ user, auctionItems, filter }: Props) => {
    let items = auctionItems.map(item =>
        <ConnectedItem
            itemData={item}
            highBid={getHighBid(item.bids)}
            user={user}
            key={item.id}
        />);

    if (filter) {
        items = items.filter((itemComponent, i) => {
            return auctionItems[i].bids.some(({ name }) => name === user);
        });
    }

    return (
        <div className="list">
            <hr />
            {items.length ? items : <EmptyList />}
        </div>
    )
};