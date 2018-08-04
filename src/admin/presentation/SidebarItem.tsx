import * as React from 'react';
import { ItemData } from '../../containers/App';

type Props = {
    itemData: ItemData;
    selected: boolean;
    clickHandler: (event: any) => void;
}

export const SidebarItem = ({ itemData, selected, clickHandler }: Props) => (
    <div className={`sidebar-item ${selected ? 'selected' : ''}`} onClick={clickHandler}>
        <span className="sidebar-item-text">{itemData.title}</span>
    </div>
)