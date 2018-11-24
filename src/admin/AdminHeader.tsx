import * as React from 'react';
import { Link } from 'react-router-dom';

export function AdminHeader() {
    return (
        <div className="admin-header">
            <Link to='/'>Back to bids</Link>
        </div>
    )
}
