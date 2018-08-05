import * as React from 'react';
import { Link } from 'react-router-dom';

export const Footer = ({ userTotal }) => (
    // TODO: Update userTotal when bid buttons are clicked
    // <div className="footer centered">Your total bids: ${userTotal}</div>
    <div className="footer centered">
        <Link exact="true" to="/admin" className="small">Admin page</Link>
    </div>
)