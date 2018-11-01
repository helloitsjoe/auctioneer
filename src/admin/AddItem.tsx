import * as React from 'react';

type Props = {
    onSelect: () => void;
}

export const AddItem = ({ onSelect }: Props) => (
    <div className="sidebar-add-item sidebar-item" onClick={onSelect}>
        <span className="plus">+</span>
    </div>
)