import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUserTotal } from '../reducers';

type Props = {
    userTotal: number;
}

export function Footer({ userTotal }: Props) {
    return (
        <div className="footer centered">
            <p className="user-total">Your total bids:</p>
            <h5>$ {userTotal}</h5>
            <Link exact="true" to="/admin" className="small admin-link">Admin page</Link>
        </div>
    )
}

const mapStateToProps = state => ({ userTotal: selectUserTotal(state) });

export default connect(mapStateToProps)(Footer);