import * as React from 'react';
import Item from './Item';
import NoItems from './NoItems';
import { AuctionItem, selectAuctionItems } from '../reducers';
import { getHighBid, getUser as getUserFromStorage } from '../utils';
import { connect } from 'react-redux';

type Props = {
  getUser: () => string;
  auctionItems: AuctionItem[];
  filter?: boolean;
};

export function List({ getUser = getUserFromStorage, auctionItems, filter }: Props) {
  const user = getUser();

  const filteredItems = filter
    ? auctionItems.filter(item => item.bids.some(({ name }) => name === user))
    : auctionItems;

  return (
    <div className="list">
      <hr />
      {filteredItems.length ? (
        filteredItems.map(item => (
          <Item user={user} key={item.id} itemData={item} highBid={getHighBid(item.bids)} />
        ))
      ) : (
        <NoItems />
      )}
    </div>
  );
}

const mapState = state => ({
  auctionItems: selectAuctionItems(state),
});

export default connect(mapState)(List);
