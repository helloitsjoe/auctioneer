import * as React from 'react';
import { SidebarItem } from './SidebarItem';
import { AddItem } from './AddItem';
import { ItemData } from '../reducers';

type Props = {
    auctionItems: ItemData[];
    selectedIndex: number;
    onSelect: (i: number) => void;
}

export const Sidebar = ({ auctionItems, selectedIndex, onSelect }: Props) => (
    <div className="sidebar">
        {auctionItems.map((item, i) => (
            <SidebarItem
                key={item.id}
                itemData={item}
                selected={i === selectedIndex}
                onSelect={() => onSelect(i)} />
        ))}
        <AddItem onSelect={() => onSelect(null)} />
    </div>
)