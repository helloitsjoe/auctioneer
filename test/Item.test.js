import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { Item } from '../src/containers/Item';
import { ItemView } from '../src/presentation/ItemView';
import { clone, quickBid, TESTER_1, TESTER_2 } from './testUtils';

const auctionItems = require('../server/data.json');

const BID_INCREMENT = 5;

describe('Item', function () {
    
    const setup = propOverrides => {
        const auctionItemsCopy = clone(auctionItems);
        const itemData = auctionItemsCopy.shift();

        const props = Object.assign({}, {
            itemData,
            user: TESTER_1
        }, propOverrides);

        const item = mount(<Item itemData={props.itemData} user={props.user} />);
        const itemView = item.find('.item-container');

        return { props, item, itemView, itemData };
    }

    it('item high bid matches highest bid in array', function () {
        const { item, itemData } = setup();
        const highBid = item.find('.high-bid');
        const maxBid = Math.max(itemData.bids.map(bid => bid.value));
        
        expect(highBid.text()).toEqual(`${maxBid}`);

        itemData.bids.push(quickBid(itemData, TESTER_1, BID_INCREMENT));
        item.setProps({ itemData });

        expect(highBid.text()).toEqual(`${maxBid + BID_INCREMENT}`);
    });

    it('quick bid button text is maxBid + bid increment', function () {
        const { item, itemData } = setup();
        const quickBidButton = item.find('.btn');
        const maxBid = Math.max(itemData.bids.map(bid => bid.value));
        
        expect(quickBidButton.text()).toEqual(`Bid ${maxBid + BID_INCREMENT}`);

        itemData.bids.push(quickBid(itemData, TESTER_1, BID_INCREMENT));
        item.setProps({ itemData });

        expect(quickBidButton.text()).toEqual(`Bid ${maxBid + (BID_INCREMENT * 2) }`);
    });

    it('item has bid-bg class when user has high bid', function () {
        const { item, itemData, itemView } = setup();
        expect(itemView.html().includes('bid-bg')).toEqual(false);

        const maxBid = Math.max(itemData.bids.map(bid => bid.value));
        itemData.bids.push({ name: TESTER_1, value: maxBid + 5 });
        item.setProps({ itemData });

        expect(itemView.html().includes('bid-bg')).toEqual(true);
    });

    it('item has outbid-bg class when they have been outbid', function () {
        const { item, itemData, itemView } = setup();
        expect(itemView.html().includes('bid-bg')).toEqual(false);

        const maxBid = Math.max(itemData.bids.map(bid => bid.value));
        const newMax = maxBid + 5;

        itemData.bids.push({ name: TESTER_1, value: newMax });
        item.setProps({ itemData });

        expect(itemView.html().includes('bid-bg')).toEqual(true);

        const outbidMax = newMax + 5;
        itemData.bids.push({ name: TESTER_2, value: outbidMax });
        item.setProps({ itemData });

        expect(itemView.html().includes('outbid-bg')).toEqual(true);
    });

    it('item has no bid class when they havent bid', function () {
        const { item, itemData, itemView } = setup();
        expect(itemView.html().includes('bid-bg')).toEqual(false);

        const maxBid = Math.max(itemData.bids.map(bid => bid.value));

        itemData.bids.push({ name: TESTER_1, value: maxBid + 5 });
        item.setProps({ itemData });

        expect(itemView.html().includes('bid-bg')).toEqual(true);

        item.setProps({ user: TESTER_2 });

        expect(itemView.html().includes('bid-bg')).toEqual(false);
        expect(itemView.html().includes('outbid-bg')).toEqual(false);
    });

    it('description is hidden on load', function () {
        const { item } = setup();
        expect(item.html().includes('closed')).toEqual(true);
        expect(item.html().includes('open')).toEqual(false);
    });

    it('toggleDescription called on click', function () {
        const { itemData } = setup();
        const toggleDescription = jest.fn();
        const highBid = { name: TESTER_1, value: 20 };
        const item = shallow(<ItemView itemData={itemData} user={TESTER_1} highBid={highBid} toggleDescription={toggleDescription} />);
        item.simulate('click');
        expect(toggleDescription).toBeCalled();
    });

    it('quickBid called on button click', function () {
        const { itemData } = setup();
        const quickBid = jest.fn();
        const highBid = { name: TESTER_1, value: 20 };
        const item = shallow(<ItemView itemData={itemData} user={TESTER_1} highBid={highBid} quickBid={quickBid} />);
        const button = item.find('button');
        button.simulate('click');
        expect(quickBid).toBeCalled();
    });
});