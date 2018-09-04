import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import ConnectedItemEditor from './ItemEditor';
import { Sidebar } from '../presentation/Sidebar';
import { AdminHeader } from '../presentation/AdminHeader';
import { addItem, selectItem } from '../../actions/adminActions';
import { ItemData } from '../../reducers';

type Props = {
    auctionItems: ItemData[];
    selectedIndex: number;
    dispatch: Dispatch;
    poller: any;
}

export const AdminPage = ({ auctionItems, selectedIndex, dispatch, poller }: Props) => {

    const handleClick = (i, e) => {
        dispatch((i === null) ? addItem() : selectItem(i));
    };

    poller.stop();

    return (<div>
        <AdminHeader />
        <div className="admin-page">
            <Sidebar
                clickHandler={handleClick}
                auctionItems={auctionItems}
                selectedIndex={selectedIndex} />
            <ConnectedItemEditor itemData={auctionItems[selectedIndex]} />
        </div>
    </div>)
}

const mapStateToProps = (state) => state;

const ConnectedAdminPage = connect(mapStateToProps)(AdminPage);
export default ConnectedAdminPage;
