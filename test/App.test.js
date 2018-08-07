import * as nock from 'nock';
import * as React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { initStore } from '../src/store';
import ConnectedApp from '../src/containers/App';
import { clone, pollForProps, TESTER_1, TESTER_2, wait } from './testUtils';

const auctionItems = require('../server/data.json');

describe.skip('App', function () {

    let store;
    let auctionItemsCopy;
    const host = 'localhost';
    const port = 3001;

    beforeEach(async () => {
        store = initStore();
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
        store = null;
        nock.cleanAll();
    })
    
    it('isLoaded = false until data returns', function () {
        const provider = mount(<Provider store={store}><ConnectedApp /></Provider>);
        const app = provider.find('App');
        expect(app.prop('isLoaded')).toBe(false);
        expect(app.prop('auctionItems')).toEqual(null);
        expect(app.html()).toEqual('<div>Loading...</div>');
    });

    describe('after data loads', function () {

        let app;
        let input;
        let provider;

        beforeEach(async () => {
            provider = mount(<Provider store={store}><ConnectedApp /></Provider>);
            // console.log(`provider:`, provider);
            // // provider.update(); // Need to call 'update()' for find() to work
            app = provider.find('App');
            input = app.find('input');
            // This doesn't seem to be working?
            await pollForProps(app, 'isLoaded');
            expect(app.prop('isLoaded')).toEqual(true);
        });

        afterEach(() => {
            provider.unmount();
        });
        
        it('isLoaded = true after data returns', function () {
            // TODO: Why is this test timing out?
            console.log(`app.prop('isLoaded'):`, app.prop('isLoaded'));
            expect(app.prop('isLoaded')).toEqual(true);
            expect(app.prop('auctionItems')).toEqual(auctionItems);
        });

        it('two users get the same initial data', function () {
            const list = app.find('.list');
            input.simulate('change', { target: { value: TESTER_1 }});
            provider.setState({}); // Trigger re-render

            const appHTMLTester1 = app.html();
            const listHTMLTester1 = list.html();
            input.simulate('change', { target: { value: TESTER_2 }});
            provider.setState({}); // Trigger re-render

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