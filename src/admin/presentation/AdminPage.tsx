import * as React from 'react';
import { Sidebar } from './Sidebar';
import { ItemEditor } from './ItemEditor';
import { AdminHeader } from './AdminHeader';
import { ItemData } from '../../containers/App';

type Props = {
    auctionItems: ItemData[];
}

export class AdminPage extends React.Component<Props, any> {

    // TODO: itemClickHandler

    render() {
        const selectedIndex = 0;

        return <div>
            <AdminHeader />
            <div className="admin-page">
                <Sidebar auctionItems={this.props.auctionItems} selectedIndex={selectedIndex} />
                <ItemEditor itemData={this.props.auctionItems[selectedIndex]} />
            </div>
        </div>
    }
}
