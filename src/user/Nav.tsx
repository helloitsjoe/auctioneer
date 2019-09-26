import * as React from 'react';
import { NavLink } from 'react-router-dom';

export function Nav() {
  return (
    <div className="centered nav-bg">
      <NavTab to="/">Auction Items</NavTab>
      <NavTab to="/user">My Bids</NavTab>
    </div>
  );
}

function NavTab(props) {
  return (
    <NavLink exact className="nav-tab" activeClassName="active" to={props.to}>
      {props.children}
    </NavLink>
  );
}
