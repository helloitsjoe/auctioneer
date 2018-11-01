import * as React from 'react';
import { ItemData } from '../reducers';

type Props = {
    itemData: ItemData;
    selected: boolean;
    onSelect: () => void;
}

export const SidebarItem = ({ itemData, selected, onSelect }: Props) => (
    <div className={`sidebar-item ${selected ? 'selected' : ''}`} onClick={onSelect}>
        <span className="sidebar-item-text">{itemData.title}</span>
    </div>
)