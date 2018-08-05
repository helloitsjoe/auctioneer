import * as React from 'react';
import { SidebarItem } from './SidebarItem';
import { AddItem } from './AddItem';
import { ItemData } from '../../containers/App';

type Props = {
    auctionItems: ItemData[];
    selectedIndex: number;
    clickHandler: (i: number, event: any) => void;
}

export const Sidebar = ({ auctionItems, selectedIndex, clickHandler }: Props) => (
    <div className="sidebar">
        {auctionItems.map((item, i) => (
            <SidebarItem
                key={i}
                itemData={item}
                selected={i === selectedIndex}
                clickHandler={clickHandler.bind(this, i)} />
        ))}
        <AddItem clickHandler={clickHandler.bind(this, null)} />
    </div>
)