import * as React from 'react';
import { Nav } from './Nav';
import { List } from './List';
import { Footer } from './Footer';
import { UserNameForm } from './UserNameForm';
import { Context } from '../Context';

type Props = {
    poller: any;
    user: string;
    filter: boolean;
    auctionItems: any;
}

export const BidsPage = ({ user, filter, auctionItems, poller }: Props) => {
    if (!poller.isPolling) {
        poller.start();
    }
    return (
        <div className="well container">
            <UserNameForm />
            <Nav />
            <List auctionItems={auctionItems} user={user} filter={filter}/>
            <Context.Consumer>
                {({ userTotal }) => {
                    console.log(`userTotal:`, userTotal);
                    return <Footer userTotal={userTotal} />
                }}
            </Context.Consumer>
        </div>
    )
}