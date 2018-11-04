import * as React from 'react';
import { ItemData } from '../reducers';

type Props = {
    itemData: ItemData;
    focused: boolean;
    onSelect: () => void;
}

export const SidebarItem = ({ itemData, focused, onSelect }: Props) => (
    <div className={`sidebar-item ${focused ? 'focused' : ''}`} onClick={onSelect}>
        <span className="sidebar-item-text">{itemData.title}</span>
    </div>
)