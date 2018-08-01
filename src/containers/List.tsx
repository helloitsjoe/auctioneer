import * as React from 'react';
import { Item } from './Item';
import { EmptyList } from '../presentation/EmptyList';

type Props = {
    user: string;
    auctionItems: any[];
    filter?: boolean;
}

export const List = (props: Props) => {
    const items = props.auctionItems
        .map((itemData, i) => <Item itemData={itemData} user={props.user} key={i} />)
        .filter((itemComponent, i) => {
            if (!props.filter) {
                return true;
            }
            return props.auctionItems[i].bids.some(bid => bid.name === props.user);
        });

    return (
        <div className="list">
            <hr />
            {items.length ? items : <EmptyList />}
        </div>
    )
};