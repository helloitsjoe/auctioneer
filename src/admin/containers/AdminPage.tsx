import * as React from 'react';
import { ItemManager } from './ItemManager';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';

const style = {
    width: '100%',
    height: '500px'
}

export const AdminPage = () => (
    <div>
        <AdminHeader />
        <div style={style}>
            <Sidebar />
            <ItemManager />
        </div>
    </div>
)
