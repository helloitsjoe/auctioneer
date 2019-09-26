import * as React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { initStore } from '../src/store';
import { BidsPage } from '../src/user/BidsPage';
import { Poller } from '../src/Poller';
import App from '../src/App';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import { clone, wait, TESTER_1, TESTER_2 } from './testUtils';
import { AdminPage } from '../src/admin/AdminPage';

const auctionItems = require('../server/data.json');

describe('App', function() {
  let store;
  let serviceMock;
  let auctionItemsCopy;

  beforeEach(async () => {
    auctionItemsCopy = clone(auctionItems);
    serviceMock = {
      fetchItems: jest.fn().mockResolvedValue({ data: auctionItemsCopy }),
      updateItem: jest.fn().mockResolvedValue({ data: { updatedItem: {} } }),
    };
    store = initStore(serviceMock);
  });

  afterEach(() => {
    auctionItemsCopy = null;
    store = null;
  });

  it('isLoaded = false until data returns', function() {
    const provider = mount(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const app = provider.find('App');
    expect(app.html()).toEqual('<div>Loading...</div>');
    provider.unmount();
  });

  it('error from data', async function() {
    const poller = new Poller();
    serviceMock.fetchItems = jest.fn().mockRejectedValue('Poop!');
    store = initStore(serviceMock);
    const provider = mount(
      <Provider store={store}>
        <App poller={poller} />
      </Provider>
    );
    await wait();
    expect(provider.find('App').text()).toEqual('Error: "Poop!"');
    expect(poller.isPolling).toBe(false);
    provider.unmount();
  });

  describe('after data loads', function() {
    const poller = new Poller();
    let provider;
    let app;

    beforeEach(async () => {
      expect(serviceMock.fetchItems).not.toHaveBeenCalled();
      provider = mount(
        <Provider store={store}>
          <App poller={poller} />
        </Provider>
      );
      await wait(); // Wait for async mockFetchService call to return
      provider.update();
      app = provider.find('App');
    });

    afterEach(() => {
      provider.unmount();
    });

    xit('can navigate to admin page', () => {
      //   console.log(`provider.debug():`, provider.debug());
      expect(provider.find(BidsPage).exists()).toBe(true);
      expect(provider.find(AdminPage).exists()).toBe(false);
      const link = provider.find('#admin-link');
      expect(link.exists()).toBe(true);
      console.log(`link.debug():`, link.debug());
      console.log(`link.hostNodes().props().onClick:`, link.hostNodes().props().onClick);
      link.first().simulate('click', { button: 0 });
      //   link
      //     .first()
      //     .props()
      //     .onClick({ button: 0 });
      //   console.log(`provider.debug():`, provider.debug());
      expect(provider.find(AdminPage).exists()).toBe(true);
      expect(provider.find(BidsPage).exists()).toBe(false);
    });

    it('isLoaded = true after data returns', function() {
      expect(serviceMock.fetchItems).toHaveBeenCalled();
      expect(app.prop('isLoaded')).toEqual(true);
    });

    it('two users get the same initial data', function() {
      const list = app.find('.list');
      const input = app.find('input');
      provider.find('input').prop('onChange')({
        target: { value: TESTER_1 },
      });

      const inputHTMLTester1 = input.html();
      const listHTMLTester1 = list.html();
      input.prop('onChange')({ target: { value: TESTER_2 } });

      const inputHTMLTester2 = input.html();
      const listHTMLTester2 = list.html();
      expect(inputHTMLTester1).not.toEqual(inputHTMLTester2);
      expect(listHTMLTester2).toEqual(listHTMLTester1);
    });

    it('bid updates when user clicks button', function() {
      const firstButton = app.find('button.btn').at(0);
      expect(firstButton.text()).toEqual('Bid 155');
      firstButton.prop('onClick')({ stopPropagation: jest.fn() });
      expect(firstButton.text()).toEqual('Bid 160');
    });

    it('user total updates when user clicks button', function() {
      const userTotal = app.find('Footer');
      const firstButton = app.find('button.btn').at(0);
      expect(userTotal.text()).toMatch('$ 0');
      firstButton.prop('onClick')({ stopPropagation: jest.fn() });
      expect(userTotal.text()).toMatch('$ 155');
    });

    it('item has bid-bg class when clicked', function() {
      const firstItem = app.find('#item-0');
      const firstButton = firstItem.find('button.btn');
      expect(firstItem.html().includes('bid-bg')).toEqual(false);
      firstButton.prop('onClick')({ stopPropagation: jest.fn() });
      expect(firstItem.html().includes('bid-bg')).toEqual(true);
    });

    it('starts poller on mount, stops on unmount', function() {
      expect(poller.isPolling).toBe(true);
      provider.unmount();
      expect(poller.isPolling).toBe(false);
    });
  });
});
