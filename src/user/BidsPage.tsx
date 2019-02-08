import * as React from 'react';
import { Nav } from './Nav';
import { List } from './List';
import Footer from './Footer';
import { UserNameForm } from './UserNameForm';

type Props = {
    poller: any;
    user: string;
    filter: boolean;
    auctionItems: any;
};

export function BidsPage({ user, filter, auctionItems, poller }: Props) {
    poller.start();

    return (
        <div className="well container">
            <UserNameForm user={user} />
            <Nav />
            <List auctionItems={auctionItems} user={user} filter={filter} />
            <Footer />
        </div>
    );
}
