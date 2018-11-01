import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import ConnectedItemEditor from './ItemEditor';
import { Sidebar } from '../presentation/Sidebar';
import { AdminHeader } from '../presentation/AdminHeader';
import { addItem, selectItem } from '../../actions/adminActions';
import { ItemData } from '../../reducers';
import { mapAllStateToProps } from '../../utils';

type Props = {
    auctionItems: ItemData[];
    selectedIndex: number;
    dispatch: Dispatch;
    poller: any;
}

export const AdminPage = ({ auctionItems, selectedIndex, dispatch, poller }: Props) => {

    const handleSelect = (i) => {
        dispatch((i === null) ? addItem() : selectItem(i));
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

export default connect(mapAllStateToProps)(AdminPage);
