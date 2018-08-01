import * as React from 'react';
import { mount } from 'enzyme';
import { Item } from '../src/containers/Item';
import { clone, quickBid, TESTER_1, TESTER_2 } from './testUtils';

const auctionItems = require('../server/data.json');

const BID_INCREMENT = 5;

describe('Item', function () {

    let item;
    let itemData;
    let itemView;

    beforeEach(() => {
        const auctionItemsCopy = clone(auctionItems);
        itemData = auctionItemsCopy.shift();
        item = mount(<Item itemData={itemData} user={TESTER_1} />);
        item.update(); // Need to call 'update()' for find() to work
        itemView = item.find('.item-container');
    });

    afterEach(() => {
        itemView = null;
        itemData = null;
        item.unmount();
    });

    it('item high bid matches highest bid in array', function () {
        const highBid = item.find('.high-bid');
        const maxBid = Math.max(itemData.bids.map(bid => bid.bid));
        
        expect(highBid.text()).toEqual(`${maxBid}`);

        itemData.bids.push(quickBid(itemData, TESTER_1, BID_INCREMENT));
        item.setProps({ itemData });

        expect(highBid.text()).toEqual(`${maxBid + BID_INCREMENT}`);
    });

    it('quick bid button text is maxBid + bid increment', function () {
        const quickBidButton = item.find('.btn');
        const maxBid = Math.max(itemData.bids.map(bid => bid.bid));
        
        expect(quickBidButton.text()).toEqual(`Bid ${maxBid + BID_INCREMENT}`);

        itemData.bids.push(quickBid(itemData, TESTER_1, BID_INCREMENT));
        item.setProps({ itemData });

        expect(quickBidButton.text()).toEqual(`Bid ${maxBid + (BID_INCREMENT * 2) }`);
    });

    it('item has bid-bg class when user has high bid', function () {
        expect(itemView.render().hasClass('bid-bg')).toEqual(false);

        const maxBid = Math.max(itemData.bids.map(bid => bid.bid));
        itemData.bids.push({ name: TESTER_1, bid: maxBid + 5 });
        item.setProps({ itemData });

        expect(itemView.render().hasClass('bid-bg')).toEqual(true);
    });

    it('item has outbid-bg class when they have been outbid', function () {
        expect(itemView.render().hasClass('bid-bg')).toEqual(false);

        const maxBid = Math.max(itemData.bids.map(bid => bid.bid));
        const newMax = maxBid + 5;

        itemData.bids.push({ name: TESTER_1, bid: newMax });
        item.setProps({ itemData });

        expect(itemView.render().hasClass('bid-bg')).toEqual(true);

        const outbidMax = newMax + 5;
        itemData.bids.push({ name: TESTER_2, bid: outbidMax });
        item.setProps({ itemData });

        expect(itemView.render().hasClass('outbid-bg')).toEqual(true);
    });

    it('item has no bid class when they havent bid', async function () {
        expect(itemView.render().hasClass('bid-bg')).toEqual(false);

        const maxBid = Math.max(itemData.bids.map(bid => bid.bid));

        itemData.bids.push({ name: TESTER_1, bid: maxBid + 5 });
        item.setProps({ itemData });

        expect(itemView.render().hasClass('bid-bg')).toEqual(true);

        // input.simulate('change', { target: { value: TESTER_2 }});
        // app.setState({}); // Trigger re-render
        item.setProps({ user: TESTER_2 });

        expect(itemView.render().hasClass('bid-bg')).toEqual(false);
        expect(itemView.render().hasClass('outbid-bg')).toEqual(false);
    });
});