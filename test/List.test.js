import * as React from 'react';
import { shallow } from 'enzyme';
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
        list = shallow(<List auctionItems={auctionItemsCopy} user={TESTER_1} filter={false} />);

        const listItems = list.find('Connect(Item)');
        expect(listItems.length).toEqual(4);
        listItems.forEach((item, i) => {
            expect(item.prop('itemData').id).toEqual(i);
        });
    });

    it('filters items user has bid on', function () {
        const TEST_INDEX = 1;
        const firstItem = auctionItemsCopy[TEST_INDEX];
        firstItem.bids.push(quickBid(firstItem, TESTER_1));

        list = shallow(<List auctionItems={auctionItemsCopy} user={TESTER_1} filter={true} />);

        const listItem = list.find('Connect(Item)');
        expect(listItem.length).toEqual(1);
        expect(listItem.prop('itemData').id).toEqual(TEST_INDEX);
    });

    it('filtered list renders EmptyList if user has no bids', function () {
        auctionItemsCopy.forEach(item => {
            expect(item.bids.some(bid => bid.name === list.props('user'))).toEqual(false);
        });

        list = shallow(<List auctionItems={auctionItemsCopy} user={TESTER_1} filter={true} />);
        expect(list.childAt(1).html()).toMatch(/<span>No bids yet!<\/span>/);
    });
});
