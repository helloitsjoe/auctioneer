import * as React from 'react';
import Nav from './Nav';
import { List } from './List';
import { Footer } from '../components/Footer';
import { UserNameForm } from '../components/UserNameForm';
import { Route } from 'react-router-dom';

type Props = {
    user: string;
    filter: boolean;
    // userTotal: number;
    auctionItems: any;
}

export const BidsPage = (props: Props) => (
    <div className="well container">
        <UserNameForm />
        <Nav />
        <List auctionItems={props.auctionItems} user={props.user} filter={props.filter}/>
        <Footer userTotal={0}/>
        {/* <Footer userTotal={props.userTotal} /> */}
    </div>
);