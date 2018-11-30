import * as React from 'react';

type Props = {
    id: number;
    title: string;
    focused: boolean;
    onSelect: () => void;
}

export function SidebarItem({ focused, title, onSelect }: Props) {
    return (
        <div className={`sidebar-item ${focused ? 'focused' : ''}`} onClick={onSelect}>
            <span className="sidebar-item-text">{title}</span>
        </div>
    )
}