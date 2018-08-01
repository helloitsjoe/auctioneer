import * as React from 'react';

export const ListItem = ({ itemData }) => (
    <div className="sidebar-item">
        <span className="sidebar-item-text">{itemData.title}</span>
    </div>
)