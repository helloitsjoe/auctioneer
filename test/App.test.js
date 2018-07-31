import * as nock from 'nock';
import * as React from 'react';
import { mount } from 'enzyme';
import { App } from '../src/containers/App';
import { clone, pollForState } from './utils';

const auctionItems = require('../server/data.json');
const TESTER_1 = 'Tester 1';
const TESTER_2 = 'Tester 2';

describe('App', function () {

    let auctionItemsCopy;
    const host = 'localhost';
    const port = 3001;

    beforeEach(async () => {
        auctionItemsCopy = clone(auctionItems);
        nock(`http://${host}:${port}`)
            // .log(console.log)
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .persist()
            .get('/data')
            .reply(200, auctionItemsCopy);
    });

    afterEach(() => {
        auctionItemsCopy = null;
        nock.cleanAll();
    })
    
    it('isLoaded = false until data returns', function () {
        const app = mount(<App />);
        expect(app.state('isLoaded')).toBe(false);
        expect(app.state('auctionItems')).toEqual(null);
        expect(app.html()).toEqual('<div>Loading...</div>');
    });

    describe('after data loads', function () {

        let app;
        let input;
        let firstItem;

        beforeEach(async () => {
            app = mount(<App />);
            await pollForState(app, 'isLoaded');
            app.update(); // Need to call 'update()' for find() to work
            input = app.find('input');
            firstItem = app.find('#item-0');
        });

        afterEach(() => {
            app.unmount();
        });
        
        it('isLoaded = true after data returns', function () {
            expect(app.state('auctionItems')).toEqual(auctionItems);
        });

        it('two users get the same initial data', function () {
            const list = app.find('.list');
            input.simulate('change', { target: { value: TESTER_1 }});
            app.setState({}); // Trigger re-render

            const appHTMLTester1 = app.html();
            const listHTMLTester1 = list.html();
            input.simulate('change', { target: { value: TESTER_2 }});
            app.setState({}); // Trigger re-render

            expect(app.html()).not.toEqual(appHTMLTester1);
            expect(list.html()).toEqual(listHTMLTester1);
        });

        it('item high bid matches highest bid in array', function () {
            input.simulate('change', { target: { value: TESTER_1 }});
            const highBid = firstItem.find('.high-bid');

            const firstItemBids = auctionItemsCopy[0].bids;
            const maxBid = Math.max(firstItemBids.map(bid => bid.bid));
            
            expect(highBid.text()).toEqual(`${maxBid}`);

            const newMax = maxBid + 5;
            firstItemBids.push({ name: TESTER_1, bid: newMax });
            app.setState({ auctionItems: auctionItemsCopy });

            expect(highBid.text()).toEqual(`${newMax}`);
        });

        it('item has bid-bg class when user has high bid', function () {
            input.simulate('change', { target: { value: TESTER_1 }});

            expect(firstItem.render().hasClass('bid-bg')).toEqual(false);

            const firstItemBids = auctionItemsCopy[0].bids;
            const maxBid = Math.max(firstItemBids.map(bid => bid.bid));

            firstItemBids.push({ name: TESTER_1, bid: maxBid + 5 });
            app.setState({ auctionItems: auctionItemsCopy });

            expect(firstItem.render().hasClass('bid-bg')).toEqual(true);
        });
    
        it('item has outbid-bg class when they have been outbid', async function () {
            input.simulate('change', { target: { value: TESTER_1 }});

            expect(firstItem.render().hasClass('bid-bg')).toEqual(false);

            const firstItemBids = auctionItemsCopy[0].bids;
            const maxBid = Math.max(firstItemBids.map(bid => bid.bid));
            const newMax = maxBid + 5;

            firstItemBids.push({ name: TESTER_1, bid: newMax });
            app.setState({ auctionItems: auctionItemsCopy });

            expect(firstItem.render().hasClass('bid-bg')).toEqual(true);

            input.simulate('change', { target: { value: TESTER_2 }});
            app.setState({}); // Trigger re-render

            const outbidMax = newMax + 5;
            firstItemBids.push({ name: TESTER_2, bid: outbidMax });
            app.setState({ auctionItems: auctionItemsCopy });

            input.simulate('change', { target: { value: TESTER_1 }});
            app.setState({}); // Trigger re-render

            expect(firstItem.render().hasClass('outbid-bg')).toEqual(true);
        });

        it('item has no bid class when they havent bid', async function () {
            input.simulate('change', { target: { value: TESTER_1 }});

            expect(firstItem.render().hasClass('bid-bg')).toEqual(false);

            const firstItemBids = auctionItemsCopy[0].bids;
            const maxBid = Math.max(firstItemBids.map(bid => bid.bid));

            firstItemBids.push({ name: TESTER_1, bid: maxBid + 5 });
            app.setState({ auctionItems: auctionItemsCopy });

            expect(firstItem.render().hasClass('bid-bg')).toEqual(true);

            input.simulate('change', { target: { value: TESTER_2 }});
            app.setState({}); // Trigger re-render

            expect(firstItem.render().hasClass('bid-bg')).toEqual(false);
            expect(firstItem.render().hasClass('outbid-bg')).toEqual(false);
        });

        // TODO: figure out why nock insn't matching the PUT sent by the click, then unskip these tests
        // it('bid updates when user clicks button', async function () {
        //     nock(`http://${host}:${port}`)
        //         .log(console.log)
        //         // .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        //         // .persist()
        //         .put('/data')
        //         .reply(200);

        //     const firstButton = app.find('#btn-0');
        //     expect(firstButton.text()).toEqual('Bid 155');
        //     firstButton.simulate('click');
        //     expect(firstButton.text()).toEqual('Bid 160');
        // });
    
        // TODO: figure out why nock insn't matching the PUT sent by the click, then u these tests
        // it('item has bid-bg class when clicked', function () {
        //     nock(`http://${host}:${port}`)
        //         .log(console.log)
        //         // .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        //         // .persist()
        //         .put('/data')
        //         .reply(200);

        //     const firstItem = app.find('#item-0');
        //     const firstButton = app.find('#btn-0');
        //     expect(firstItem.render().hasClass('bid-bg')).toEqual(false);
        //     firstButton.simulate('click');
        //     expect(firstItem.render().hasClass('bid-bg')).toEqual(true);      
        // });
    });
});