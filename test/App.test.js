import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { initStore } from '../src/store';
import ConnectedApp from '../src/containers/App';
import { clone, TESTER_1, TESTER_2 } from './testUtils';

const auctionItems = require('../server/data.json');

describe('App', function () {

    let store;
    let moxios;
    let auctionItemsCopy;

    beforeEach(async () => {
        store = initStore({ axios: moxios });
        auctionItemsCopy = clone(auctionItems);
        moxios = {
            get: jest.fn().mockResolvedValue({ data: auctionItemsCopy }),
            put: jest.fn(),
        }
    });

    afterEach(() => {
        auctionItemsCopy = null;
        store = null;
    })
    
    it('isLoaded = false until data returns', function () {
        const provider = mount(<Provider store={store}><ConnectedApp axios={moxios}/></Provider>);
        const app = provider.find('App');
        expect(moxios.get).toHaveBeenCalled();
        expect(app.prop('isLoaded')).toBe(false);
        expect(app.prop('auctionItems')).toEqual(null);
        expect(app.html()).toEqual('<div>Loading...</div>');
    });

    describe('after data loads', function () {

        let provider;
        let app;

        beforeEach((done) => {
            provider = mount(<Provider store={store}><ConnectedApp axios={moxios}/></Provider>);
            setTimeout(() => {
                provider.update();
                app = provider.find('App');
                done();
            });
        });

        afterEach(() => {
            provider.unmount();
        });
        
        it('isLoaded = true after data returns', function () {
            expect(app.prop('isLoaded')).toEqual(true);
            expect(app.prop('auctionItems')).toEqual(auctionItems);
        });

        it.skip('two users get the same initial data', function () {
            const list = app.find('.list');
            // const input = app.find('input');
            console.log(`input.debug():`, provider.find('input').html());
            // input.instance().value = TESTER_1;
            // TODO: Why isn't this changing input value?
            provider.find('input').simulate('change', { target: { value: TESTER_1 }});
            console.log(`input.debug():`, provider.find('input').html());
            // provider.setState({}); // Trigger re-render
            // provider.update();

            const appHTMLTester1 = app.html();
            const listHTMLTester1 = list.html();
            input.simulate('change', { target: { value: TESTER_2 }});
            // provider.setState({}); // Trigger re-render
            console.log(`provider TWO:`, provider.html());
            provider.update();

            expect(app.html()).not.toEqual(appHTMLTester1);
            expect(list.html()).toEqual(listHTMLTester1);
        });

        // Clicking on My Bids should render user bids

        it('bid updates when user clicks button', async function () {
            const firstButton = app.find('button.btn').first();
            expect(firstButton.text()).toEqual('Bid 155');
            firstButton.simulate('click');
            expect(firstButton.text()).toEqual('Bid 160');
        });
    
        it('item has bid-bg class when clicked', function () {
            const firstItem = app.find('#item-0');
            const firstButton = firstItem.find('button.btn');
            expect(firstItem.render().hasClass('bid-bg')).toEqual(false);
            firstButton.simulate('click');
            expect(firstItem.render().hasClass('bid-bg')).toEqual(true);      
        });
    });
});