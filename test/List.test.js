import * as React from 'react';
import { mount } from 'enzyme';
import { List } from '../src/containers/List';
import { clone, quickBid, TESTER_1 } from './testUtils';

const auctionItems = require('../server/data.json');

describe('List', function () {

    let list;
    let auctionItemsCopy;

    beforeEach(() => {
        auctionItemsCopy = clone(auctionItems);
    });

    afterEach(() => {
        list.unmount();
    });

    it('renders each item in the right order', function () {
        list = mount(<List auctionItems={auctionItemsCopy} user={TESTER_1} filter={false} />);
        list.update(); // Need to call 'update()' for find() to work

        const listItems = list.find('.item-container');
        expect(listItems.length).toEqual(4);
        listItems.forEach((item, i) => {
            expect(item.find(`#item-${i}`).length).toEqual(1);
        });
    });

    it('filters items user has bid on', function () {
        const firstItem = auctionItemsCopy[0];
        firstItem.bids.push(quickBid(firstItem, TESTER_1));

        list = mount(<List auctionItems={auctionItemsCopy} user={TESTER_1} filter={true} />);
        list.update(); // Need to call 'update()' for find() to work

        const listItems = list.find('.item-container');
        expect(listItems.length).toEqual(1);
        expect(listItems.find(`#item-0`).length).toEqual(1);
    });

    it('filtered list renders EmptyList if user has no bids', function () {
        auctionItemsCopy.forEach(item => {
            expect(item.bids.some(bid => bid.name === list.props('user'))).toEqual(false);
        });

        list = mount(<List auctionItems={auctionItemsCopy} user={TESTER_1} filter={true} />);
        list.update(); // Need to call 'update()' for find() to work

        const listItems = list.find('.item-container');
        expect(listItems.length).toEqual(1);
        expect(listItems.childAt(0).html()).toEqual('<span>No bids yet!</span>');
    });
});
