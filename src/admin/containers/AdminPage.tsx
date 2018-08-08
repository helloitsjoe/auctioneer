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

export class AdminPage extends React.Component<Props, null> {

    handleClick = (i, e) => {
        this.props.dispatch((i === null) ? addItem() : selectItem(i));
    }

    // updateTitle = (title, id) => {
        // This seems weird. Probably a better way to do this. Redux?
        // const auctionItems = this.props.auctionItems.map(item => {
        //     if (item.id === id) {
        //         item.title = title;
        //     }
        //     return item;
        // });
        // this.setState({ auctionItems });
    // }

    submitChanges = (itemState, e) => {
        e.preventDefault();
        const { auctionItems, selectedIndex } = this.props;

        const selectedItem = auctionItems[selectedIndex];
        // selectedItem.bids[0].value = itemState.minBid;
        // const updatedItem = Object.assign({}, selectedItem, itemState);

        axios.put(DATA_URL, { body: JSON.stringify(selectedItem) });

        // const updatedItems = auctionItems.map(item => (item.id === itemState.id) ? updatedItem : item);

        // this.setState({ auctionItems: updatedItems });
    }

    render() {

        const { poller, auctionItems, selectedIndex } = this.props;
        poller.stop();

        return <div>
            <AdminHeader />
            <div className="admin-page">
                <Sidebar
                    clickHandler={this.handleClick}
                    auctionItems={auctionItems}
                    selectedIndex={selectedIndex} />
                <ConnectedItemEditor
                    // updateTitle={this.updateTitle}
                    submitChanges={this.submitChanges}
                    itemData={auctionItems[selectedIndex]} />
            </div>
        </div>
    }
}

const mapStateToProps = (state) => state;

const ConnectedAdminPage = connect(mapStateToProps)(AdminPage);
export default ConnectedAdminPage;
