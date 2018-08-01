import * as React from 'react';
import { ListItem } from './ListItem';
import { AddItem } from './AddItem';

export const Sidebar = ({ auctionItems }) => (
    <div className="sidebar">
        {auctionItems.map((item, i) => <ListItem itemData={item} key={i} />)}
        <AddItem />
    </div>
)
