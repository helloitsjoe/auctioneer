import axios from 'axios';
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import ConnectedItemEditor from './ItemEditor';
import { DATA_URL } from '../../utils';
import { Sidebar } from '../presentation/Sidebar';
import { AdminHeader } from '../presentation/AdminHeader';
import { addItem, selectItem } from '../../actions/adminActions';
import { ItemData } from '../../reducers/auctionItemsReducer';

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

    const submitChanges = (e) => {
        e.preventDefault();
        const selectedItem = auctionItems[selectedIndex];
        axios.put(DATA_URL, { body: JSON.stringify(selectedItem) });
    };

    poller.stop();

    return (<div>
        <AdminHeader />
        <div className="admin-page">
            <Sidebar
                clickHandler={handleClick}
                auctionItems={auctionItems}
                selectedIndex={selectedIndex} />
            <ConnectedItemEditor
                submitChanges={submitChanges}
                itemData={auctionItems[selectedIndex]} />
        </div>
    </div>)
}

const mapStateToProps = (state) => state;

const ConnectedAdminPage = connect(mapStateToProps)(AdminPage);
export default ConnectedAdminPage;
