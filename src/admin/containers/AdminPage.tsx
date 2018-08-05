import axios from 'axios';
import * as React from 'react';
import { Sidebar } from '../presentation/Sidebar';
import { ItemEditor } from './ItemEditor';
import { AdminHeader } from '../presentation/AdminHeader';
import { ItemData } from '../../containers/App';
import { DATA_URL, createNewAuctionItem } from '../../utils';

type Props = {
    auctionItems: ItemData[];
    poller: any;
}

type State = {
    selectedIndex: number;
    auctionItems: ItemData[];
}

export class AdminPage extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        // Cancel poller on admin page. For now, need to
        // refresh back on bids page to kick off the poller again. TODO: fix this.
        clearInterval(this.props.poller);

        this.state = {
            selectedIndex: 0,
            auctionItems: this.props.auctionItems,
        }
    }

    handleClick = (i, e) => {
        if (i === null) { // AddItem
            const id = this.state.auctionItems.length;
            const auctionItems = [...this.state.auctionItems, createNewAuctionItem({ id })];
            this.setState({ auctionItems, selectedIndex: id  });
        } else {
            this.setState({ selectedIndex: i });
        }
    }

    updateTitle = (title, id) => {
        // This seems weird. Probably a better way to do this. Redux?
        const auctionItems = this.state.auctionItems.map(item => {
            if (item.id === id) {
                item.title = title;
            }
            return item;
        });
        this.setState({ auctionItems });
    }

    submitChanges = (itemState, e) => {
        e.preventDefault();
        const { auctionItems, selectedIndex } = this.state;

        const selectedItem = auctionItems[selectedIndex];
        selectedItem.bids[0].value = itemState.minBid;
        const updatedItem = Object.assign({}, selectedItem, itemState);

        axios.put(DATA_URL, { body: JSON.stringify(updatedItem) });

        const itemsCopy = [...auctionItems];
        itemsCopy[selectedIndex] = updatedItem;

        this.setState({ auctionItems: itemsCopy });
    }

    render() {
        return <div>
            <AdminHeader />
            <div className="admin-page">
                <Sidebar
                    clickHandler={this.handleClick}
                    auctionItems={this.state.auctionItems}
                    selectedIndex={this.state.selectedIndex} />
                <ItemEditor
                    updateTitle={this.updateTitle}
                    submitChanges={this.submitChanges}
                    itemData={this.state.auctionItems[this.state.selectedIndex]} />
            </div>
        </div>
    }
}
