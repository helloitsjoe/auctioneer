import * as React from 'react';
import { ItemEditor } from './ItemEditor';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';

type Props = {
    auctionItems: any;
}

export class AdminPage extends React.Component<Props, any> {

    // TODO: itemClickHandler

    render() {
        return <div>
            <AdminHeader />
            <div className="admin-page">
                <Sidebar auctionItems={this.props.auctionItems}/>
                <ItemEditor />
            </div>
        </div>
    }
}
