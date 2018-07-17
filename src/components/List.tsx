import * as React from 'react';
import Item from './Item';
import { EmptyList } from './EmptyList';

type Props = {
    data: any[];
    filter?: boolean;
}

export const List = (props: Props) => {
    const items = props.data.map((itemData, i) => {
        return props.filter ? itemData.bids.find(bid => bid.name === window.sessionStorage.userID) &&
            <Item itemData={itemData} key={i} />
            : <Item itemData={itemData} key={i} />;
    }).filter(Boolean);
    return (
        <div className="list">
            <hr />
            {items.length ? items : <EmptyList />}
        </div>
    )
};
