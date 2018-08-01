import * as nock from 'nock';
import * as React from 'react';
import { mount } from 'enzyme';
import { App } from '../src/containers/App';
import { clone, pollForState, TESTER_1, TESTER_2 } from './testUtils';

const auctionItems = require('../server/data.json');

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

        beforeEach(async () => {
            app = mount(<App />);
            await pollForState(app, 'isLoaded');
            app.update(); // Need to call 'update()' for find() to work
            input = app.find('input');
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

        // Clicking on My Bids should render user bids

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