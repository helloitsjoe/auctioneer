import * as React from 'react';
import { AddItem } from './AddItem';
import { SidebarItem } from './SidebarItem';
import { ItemData } from '../reducers';

type Props = {
    title: string;
    items: ItemData[];
    focusedIndex: number;
    onAddItem: () => void,
    onItemFocus: (i: number) => void
}

export function Sidebar({ items, focusedIndex, title, onAddItem, onItemFocus }: Props) {
    return (
        <div className="sidebar">
            {items.map((item, i) => {
                const focused = i === focusedIndex;
                return (
                    <SidebarItem
                        key={item.id}
                        id={item.id}
                        focused={focused}
                        title={focused ? title : item.title}
                        onSelect={() => onItemFocus(i)}
                    />
                )
            })}
            <AddItem onSelect={onAddItem} />
        </div>
    )
}
