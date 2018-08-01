import * as React from 'react';
import Nav from './Nav';
import { List } from './List';
import { Footer } from '../presentation/Footer';
import { UserNameForm } from '../presentation/UserNameForm';

type Props = {
    user: string;
    filter: boolean;
    auctionItems: any;
    // userTotal: number;
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