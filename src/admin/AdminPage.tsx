import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import ConnectedItemEditor from './ItemEditor';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { addItem, itemFocus } from '../actions/adminActions';
import { ItemData, selectAuctionItems, selectSelectedIndex } from '../reducers';

type Props = {
    auctionItems: ItemData[];
    selectedIndex: number;
    dispatch: Dispatch;
    poller: any;
}

export const AdminPage = ({ auctionItems, selectedIndex, dispatch, poller }: Props) => {

    const handleSelect = (i) => {
        dispatch((i === null) ? addItem() : itemFocus(i));
    };

    poller.stop();

    return (<div>
        <AdminHeader />
        <div className="admin-page">
            <Sidebar
                onSelect={handleSelect}
                auctionItems={auctionItems}
                selectedIndex={selectedIndex} />
            <ConnectedItemEditor itemData={auctionItems[selectedIndex]} />
        </div>
    </div>)
}

const mapStateToProps = state => ({
    auctionItems: selectAuctionItems(state),
    selectedIndex: selectSelectedIndex(state),
});

export default connect(mapStateToProps)(AdminPage);
