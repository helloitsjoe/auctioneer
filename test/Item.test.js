import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { clone, quickBid, TESTER_1, TESTER_2 } from './testUtils';
import { getHighBid } from '../src/utils';
import { Item } from '../src/user/Item';

const auctionItems = require('../server/data.json');

const BID_INCREMENT = 5;

describe('Item', function () {
    
    const setup = propOverrides => {
        const auctionItemsCopy = clone(auctionItems);
        const itemData = auctionItemsCopy.shift();
        const user = TESTER_1;

        const props = { itemData, user, ...propOverrides };

        const item = mount(
            <Item
                user={props.user}
                itemData={props.itemData}
                highBid={getHighBid(itemData.bids)}
            />
        );

        return { item, itemData };
    }

    it('item high bid matches highest bid in array', function () {
        const { item, itemData } = setup();
        const highBid = item.find('.high-bid');
        const maxBid = Math.max(itemData.bids.map(bid => bid.value));
        
        expect(highBid.text()).toEqual(`${maxBid}`);
    
        itemData.bids.push(quickBid(itemData, TESTER_1));

        item.setProps({ highBid: getHighBid(itemData.bids) });
    
        expect(highBid.text()).toEqual(`${maxBid + BID_INCREMENT}`);
    });

    it('quick bid button text is maxBid + bid increment', function () {
        const { item, itemData } = setup();
        const quickBidButton = item.find('.btn');
        const maxBid = Math.max(itemData.bids.map(bid => bid.value));
        
        expect(quickBidButton.text()).toEqual(`Bid ${maxBid + BID_INCREMENT}`);

        itemData.bids.push(quickBid(itemData, TESTER_1));
    
        item.setProps({ highBid: getHighBid(itemData.bids) });

        expect(quickBidButton.text()).toEqual(`Bid ${maxBid + (BID_INCREMENT * 2) }`);
    });

    it('item has bid-bg class when user has high bid', function () {
        const { item, itemData } = setup();
        expect(item.html().includes('bid-bg')).toEqual(false);

        const maxBid = Math.max(itemData.bids.map(bid => bid.value));
        itemData.bids.push({ name: TESTER_1, value: maxBid + BID_INCREMENT });
        item.setProps({ highBid: getHighBid(itemData.bids) });

        expect(item.html().includes('bid-bg')).toEqual(true);
        expect(item.html().includes('outbid-bg')).toEqual(false);
    });

    it('item has outbid-bg class when they have been outbid', function () {
        const { item, itemData } = setup();
        expect(item.html().includes('bid-bg')).toEqual(false);

        const maxBid = Math.max(itemData.bids.map(bid => bid.value));
        const newMax = maxBid + BID_INCREMENT;

        itemData.bids.push({ name: TESTER_1, value: newMax });
        item.setProps({ highBid: getHighBid(itemData.bids) });

        expect(item.html().includes('bid-bg')).toEqual(true);
        expect(item.html().includes('outbid-bg')).toEqual(false);

        const outbidMax = newMax + BID_INCREMENT;
        itemData.bids.push({ name: TESTER_2, value: outbidMax });
        item.setProps({ highBid: getHighBid(itemData.bids) });

        expect(item.html().includes('outbid-bg')).toEqual(true);
    });

    it('item has no bid class when they havent bid', function () {
        const { item, itemData } = setup();
        expect(item.html().includes('bid-bg')).toEqual(false);
        expect(item.html().includes('outbid-bg')).toEqual(false);

        const maxBid = Math.max(itemData.bids.map(bid => bid.value));

        itemData.bids.push({ name: TESTER_1, value: maxBid + BID_INCREMENT });
        item.setProps({ itemData });

        expect(item.html().includes('bid-bg')).toEqual(true);

        item.setProps({ user: TESTER_2 });

        expect(item.html().includes('bid-bg')).toEqual(false);
        expect(item.html().includes('outbid-bg')).toEqual(false);
    });

    it('description is hidden on load', function () {
        const { item } = setup();
        expect(item.html().includes('closed')).toEqual(true);
        expect(item.html().includes('open')).toEqual(false);
    });

    it('toggleDescription called on click', function () {
        const { itemData } = setup();
        const quickBid = jest.fn();
        const toggleDescription = jest.fn();
        const highBid = { name: TESTER_1, value: 20 };
        const item = shallow(
            <Item
                itemData={itemData}
                user={TESTER_1}
                highBid={highBid}
                onQuickBid={quickBid}
                onToggleDescription={toggleDescription}
            />);
        item.simulate('click');
        expect(toggleDescription).toBeCalledTimes(1);
        expect(quickBid).not.toBeCalled();
    });

    it('quickBid called on button click', function () {
        const { itemData } = setup();
        const quickBid = jest.fn();
        const toggleDescription = jest.fn();
        const highBid = { name: TESTER_1, value: 20 };
        const item = shallow(
            <Item
                itemData={itemData}
                user={TESTER_1}
                highBid={highBid}
                onQuickBid={quickBid}
                onToggleDescription={toggleDescription}
            />);
        const button = item.find('button');
        button.simulate('click');
        expect(quickBid).toBeCalledTimes(1);
        expect(toggleDescription).not.toBeCalled();
    });
});