import * as React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { initStore } from '../src/store';
import { List } from '../src/user/List';
import { clone, quickBid, TESTER_1 } from './testUtils';
import { BID_INCREMENT } from '../src/reducers';

const auctionItems = require('../server/data.json');

describe('List', function () {

    const setup = propOverrides => {
        const auctionItemsCopy = clone(auctionItems);
        const props = {
            getUser: () => TESTER_1,
            filter: false,
            ...propOverrides
        }

        const list = mount(
            <Provider store={initStore()}>
                <List auctionItems={auctionItemsCopy} getUser={props.getUser} filter={props.filter} />
            </Provider>
        );

        return { auctionItemsCopy, list }
    }

    it('renders each item in the right order', function () {
        const { list } = setup();

        const listItems = list.find('Connect(Item)');
        expect(listItems.length).toEqual(4);
        listItems.forEach((item, i) => {
            expect(item.prop('itemData').id).toEqual(i);
        });
    });

    it('filters items user has bid on', function () {
        const { auctionItemsCopy, list } = setup({ filter: true });
        const TEST_INDEX = 1;
        const firstItem = auctionItemsCopy[TEST_INDEX];
        firstItem.bids.push(quickBid(firstItem, TESTER_1, BID_INCREMENT));
        list.setProps({ auctionItems: auctionItemsCopy });

        const listItem = list.find('Connect(Item)');
        expect(listItem.length).toEqual(1);
        expect(listItem.prop('itemData').id).toEqual(TEST_INDEX);
    });

    it('filtered list renders EmptyList if user has no bids', function () {
        const { auctionItemsCopy, list } = setup({ filter: true });
        auctionItemsCopy.forEach(item => {
            expect(item.bids.some(bid => bid.name === list.props('user'))).toEqual(false);
        });

        expect(list.text()).toBe('No bids yet!');
    });
});
