import * as React from 'react';
import { ListItem } from './ListItem';
import { AddItem } from './AddItem';
import { ItemData } from '../../containers/App';

type Props = {
    auctionItems: ItemData[];
    selectedIndex: number;
}

export const Sidebar = ({ auctionItems, selectedIndex }: Props) => (
    <div className="sidebar">
        {auctionItems.map((item, i) => <ListItem itemData={item} key={i} selected={i === selectedIndex} />)}
        <AddItem />
    </div>
)
