import * as React from 'react';
import { connect } from 'react-redux';
import { AddItem } from './AddItem';
import { SidebarItem } from './SidebarItem';
import { addItem, itemFocus } from '../actions/adminActions';
import { ItemData, selectAuctionItems, selectFocusedIndex } from '../reducers';

type Props = {
    auctionItems: ItemData[];
    focusedIndex: number;
    onItemClick: (i: number) => void;
}

export const Sidebar = ({ auctionItems, focusedIndex, onItemClick }: Props) => (
    <div className="sidebar">
        {auctionItems.map((item, i) => (
            <SidebarItem
                key={item.id}
                itemData={item}
                focused={i === focusedIndex}
                onSelect={() => onItemClick(i)} />
        ))}
        <AddItem onSelect={() => onItemClick(null)} />
    </div>
)

const mapState = state => ({
    auctionItems: selectAuctionItems(state),
    focusedIndex: selectFocusedIndex(state),
})

const mapDispatch = {
    onItemClick(i: number) {
        return (i === null) ? addItem() : itemFocus(i);
    }
}

export default connect(mapState, mapDispatch)(Sidebar);