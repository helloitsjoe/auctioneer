import * as React from 'react';

type Props = {
    clickHandler: (e: any) => void;
}

export const AddItem = ({ clickHandler }: Props) => (
    <div className="sidebar-add-item sidebar-item" onClick={clickHandler}>
        <span className="plus">+</span>
    </div>
)