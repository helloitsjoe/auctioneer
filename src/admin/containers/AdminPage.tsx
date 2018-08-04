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
}

export class AdminPage extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        // Cancel poller on admin page. For now, need to
        // refresh back on bids page to kick off the poller again. TODO: fix this.
        clearInterval(this.props.poller);

        this.state = {
            selectedIndex: 0
        }
    }

    // TODO: itemClickHandler
    handleClick = (i, e) => {
        console.log(`Clicked:`, this.props.auctionItems[i].title);
        this.setState({ selectedIndex: i });
    }

    render() {
        return <div>
            <AdminHeader />
            <div className="admin-page">
                <Sidebar
                    clickHandler={this.handleClick}
                    auctionItems={this.props.auctionItems}
                    selectedIndex={this.state.selectedIndex} />
                <ItemEditor itemData={this.props.auctionItems[this.state.selectedIndex]} />
            </div>
        </div>
    }
}
