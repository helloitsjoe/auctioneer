import * as React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { initStore } from '../src/store';
import { Poller } from '../src/Poller';
import App from '../src/App';
import { clone, wait, TESTER_1, TESTER_2 } from './testUtils';

const auctionItems = require('../server/data.json');

describe('App', function () {

    let store;
    let moxios;
    let auctionItemsCopy;

    beforeEach(async () => {
        auctionItemsCopy = clone(auctionItems);
        moxios = {
            get: jest.fn().mockResolvedValue({ data: auctionItemsCopy }),
            put: jest.fn().mockResolvedValue({ data: { updatedItem: {} } }),
        }
        store = initStore({ axios: moxios });
    });

    afterEach(() => {
        auctionItemsCopy = null;
        store = null;
    })
    
    it('isLoaded = false until data returns', function () {
        const provider = mount(
            <Provider store={store}>
                <App />
            </Provider>
        );
        const app = provider.find('App');
        expect(app.html()).toEqual('<div>Loading...</div>');
    });

    it('error from data', async function () {
        const poller = new Poller();
        moxios.get = jest.fn().mockRejectedValue('Poop!');
        store = initStore({ axios: moxios });
        const provider = mount(
            <Provider store={store}>
                <App poller={poller}/>
            </Provider>
        );
        await wait();
        provider.update();
        const app = provider.find('App');
        expect(app.html()).toEqual('<div>Error: \"Poop!\"</div>');
        expect(poller.isPolling).toBe(false);
    });
    
    describe('after data loads', function () {
        
        const poller = new Poller();
        let provider;
        let app;

        beforeEach(async () => {
            expect(moxios.get).not.toHaveBeenCalled();
            provider = mount(
                <Provider store={store}>
                    <App poller={poller}/>
                </Provider>
            );
            await wait(); // Wait for async moxios call to return
            provider.update();
            app = provider.find('App');
        });

        afterEach(() => {
            provider.unmount();
        });
        
        it('isLoaded = true after data returns', function () {
            expect(moxios.get).toHaveBeenCalled();
            expect(app.prop('isLoaded')).toEqual(true);
            expect(app.prop('auctionItems')).toEqual(auctionItems);
        });

        it('two users get the same initial data', function () {
            const list = app.find('.list');
            const input = app.find('input');
            provider.find('input').prop('onChange')({ target: { value: TESTER_1 }});

            const inputHTMLTester1 = input.html();
            const listHTMLTester1 = list.html();
            input.prop('onChange')({ target: { value: TESTER_2 }});
            
            const inputHTMLTester2 = input.html();
            const listHTMLTester2 = list.html();
            expect(inputHTMLTester1).not.toEqual(inputHTMLTester2);
            expect(listHTMLTester2).toEqual(listHTMLTester1);
        });

        it('bid updates when user clicks button', async function () {
            const firstButton = app.find('button.btn').at(0);
            expect(firstButton.text()).toEqual('Bid 155');
            firstButton.prop('onClick')({ stopPropagation: jest.fn() });
            expect(firstButton.text()).toEqual('Bid 160');
        });
    
        it('item has bid-bg class when clicked', function () {
            const firstItem = app.find('#item-0');
            const firstButton = firstItem.find('button.btn');
            expect(firstItem.html().includes('bid-bg')).toEqual(false);
            firstButton.prop('onClick')({ stopPropagation: jest.fn() });
            expect(firstItem.html().includes('bid-bg')).toEqual(true);      
        });

        it('starts poller on mount, stops on unmount', function () {
            expect(poller.isPolling).toBe(true);
            provider.unmount();
            expect(poller.isPolling).toBe(false);
        });
    });
});