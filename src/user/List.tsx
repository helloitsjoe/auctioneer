import * as React from 'react';
import Item from './Item';
import { EmptyList } from './EmptyListView';
import { AuctionItem } from '../reducers';
import { getHighBid } from '../utils';

type Props = {
    user: string;
    auctionItems: AuctionItem[];
    filter?: boolean;
}

export function List({ user, auctionItems, filter }: Props) {

    const filteredItems = filter
        ? auctionItems.filter(item => item.bids.some(({name}) => name === user))
        : auctionItems;

    return (
        <div className="list">
            <hr />
            {filteredItems.length ? filteredItems
                .map(item => 
                    <Item
                        user={user}
                        key={item.id}
                        itemData={item}
                        highBid={getHighBid(item.bids)}
                    />            
                ) : <EmptyList />
            }
        </div>
    )
};