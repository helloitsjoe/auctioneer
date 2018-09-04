import * as React from 'react';
import ConnectedItem from './Item';
import { EmptyList } from '../presentation/EmptyList';
import { ItemData } from '../reducers';
import { Context } from '../Context';

type Props = {
    user: string;
    auctionItems: ItemData[];
    filter?: boolean;
}

export const List = ({ user, auctionItems, filter }: Props) => {
    let items = auctionItems.map((item, i) => (
        <Context.Consumer>
            {({ incrementTotal }) => {
                // console.log(`incrementTotal:`, incrementTotal);
                return <ConnectedItem incrementTotal={incrementTotal} itemData={item} user={user} key={i} />
            }}
        </Context.Consumer>
    ));
    
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