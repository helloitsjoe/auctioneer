import * as React from 'react';
import { NavLink } from 'react-router-dom';

export const Nav = () => (
    <div className="centered nav-bg">
        <NavLink exact to="/" className="nav-tab" activeClassName="active">Auction Items</NavLink>
        <NavLink exact to="/user" className="nav-tab" activeClassName="active">My Bids</NavLink>
    </div>
);
