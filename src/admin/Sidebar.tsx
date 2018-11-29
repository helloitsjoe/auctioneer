import * as React from 'react';
import { AddItem } from './AddItem';
import { SidebarItem } from './SidebarItem';
import { ItemData } from '../reducers';

type Props = {
    items: ItemData[];
    focusedIndex: number;
    focusedItem: ItemData;
    onAddItem: () => void,
    onItemFocus: (i: number) => void
}

export function Sidebar({ items, focusedItem, focusedIndex, onAddItem, onItemFocus }: Props) {
    return (
        <div className="sidebar">
            {items.map((item, i) => {
                const focused = i === focusedIndex;
                return (
                    <SidebarItem
                        key={item.id}
                        id={item.id}
                        focused={focused}
                        title={focused ? focusedItem.title : item.title}
                        onSelect={() => onItemFocus(i)}
                    />
                )
            })}
            <AddItem onSelect={onAddItem} />
        </div>
    )
}
