import * as React from 'react';
import Item from './Item';

type Props = {
    data: any[];
    filter?: boolean;
}

export const List = (props: Props) => (
    <div className="list">
        <hr />
        {props.data.map((itemData, i) => {
            return props.filter ? itemData.bids.find(bid => bid.name === window.localStorage.userID) &&
                <Item itemData={itemData} key={i} />
                : <Item itemData={itemData} key={i} />;
        })}
    </div>
)
