import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { mapAllStateToProps } from '../utils';

type Props = {
    userTotal: number;
}

export const Footer = ({ userTotal }: Props) => (
    <div className="footer centered">
        <p className="user-total">Your total bids:</p>
        <h5>$ {userTotal}</h5>
        <Link exact="true" to="/admin" className="small">Admin page</Link>
    </div>
)

const ConnectedFooter = connect(mapAllStateToProps)(Footer);
export default ConnectedFooter;