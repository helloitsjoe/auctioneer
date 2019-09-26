import * as React from 'react';
import { Nav } from './Nav';
import List from './List';
import Footer from './Footer';
import { UserNameForm } from './UserNameForm';

type Props = {
  poller: any;
  filter: boolean;
};

export function BidsPage({ filter, poller }: Props) {
  poller.start();

  return (
    <div className="well container">
      <UserNameForm />
      <Nav />
      <List filter={filter} />
      <Footer />
    </div>
  );
}
