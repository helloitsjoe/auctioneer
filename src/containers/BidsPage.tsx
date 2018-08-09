import * as React from 'react';
import { Nav } from './Nav';
import { List } from './List';
import ConnectedFooter from './Footer';
import { UserNameForm } from '../presentation/UserNameForm';

type Props = {
    poller: any;
    user: string;
    filter: boolean;
    auctionItems: any;
}

export const BidsPage = ({ user, filter, auctionItems, poller }: Props) => {
    // TODO: Figure out how to trigger a render when coming back to the bids page
    if (!poller.isPolling) {
        poller.start();
    }
    return (
        <div className="well container">
            <UserNameForm />
            <Nav />
            <List auctionItems={auctionItems} user={user} filter={filter}/>
            <ConnectedFooter />
        </div>
    )
}