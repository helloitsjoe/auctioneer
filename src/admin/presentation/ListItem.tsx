import * as React from 'react';
import { ItemData } from '../../containers/App';

type Props = {
    itemData: ItemData;
    selected: boolean;
}

export const ListItem = ({ itemData, selected }: Props) => (
    <div className={`sidebar-item ${selected && 'selected'}`}>
        <span className="sidebar-item-text">{itemData.title}</span>
    </div>
)