import * as React from 'react';

type Props = {
    onSelect: () => void;
}

export function AddItem({ onSelect }: Props) {
    return (
        <div className="sidebar-add-item sidebar-item" onClick={onSelect}>
            <span className="plus">+</span>
        </div>
    )
}