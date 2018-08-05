import * as React from 'react';
import { Sidebar } from '../presentation/Sidebar';
import { ItemEditor } from './ItemEditor';
import { AdminHeader } from '../presentation/AdminHeader';
import { ItemData } from '../../containers/App';

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
        // Handle click on AddItem
        this.setState({ selectedIndex: i });
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
                    itemData={this.props.auctionItems[this.state.selectedIndex]} />
            </div>
        </div>
    }
}
