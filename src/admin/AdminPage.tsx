import * as React from 'react';

import ItemEditor from './ItemEditor';
import Sidebar from './Sidebar';
import { AdminHeader } from './AdminHeader';

type Props = {
    poller: any;
}

export const AdminPage = ({ poller }: Props) => {

    poller.stop();

    return (
        <div>
            <AdminHeader />
            <div className="admin-page">
                <Sidebar />
                <ItemEditor />
            </div>
        </div>
    )
}
