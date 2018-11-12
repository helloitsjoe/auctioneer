import * as React from 'react';
import { connect } from 'react-redux';
import { AddItem } from './AddItem';
import { SidebarItem } from './SidebarItem';
import { addItem, itemFocus } from '../actions/adminActions';
import { ItemData, selectAuctionItems, selectFocusedIndex } from '../reducers';

type Props = {
    auctionItems: ItemData[];
    focusedIndex: number;
    addItem: () => void,
    itemFocus: (i: number) => void
}

export const Sidebar = ({ auctionItems, focusedIndex, addItem, itemFocus }: Props) => (
    <div className="sidebar">
        {auctionItems.map((item, i) => (
            <SidebarItem
                key={item.id}
                itemData={item}
                focused={i === focusedIndex}
                onSelect={() => itemFocus(i)} />
        ))}
        <AddItem onSelect={addItem} />
    </div>
)

const mapState = state => ({
    auctionItems: selectAuctionItems(state),
    focusedIndex: selectFocusedIndex(state),
})

export const mapDispatchToProps = { addItem, itemFocus }

export default connect(mapState, mapDispatchToProps)(Sidebar);