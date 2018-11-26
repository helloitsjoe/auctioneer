import * as React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { Poller } from '../src/Poller';
import ConnectedAdminPage, {AdminPage} from '../src/admin/AdminPage';
import { AdminHeader } from '../src/admin/AdminHeader';
import { initStore } from '../src/store';
import { fetchAuctionSuccess } from '../src/actions/auctionItemActions';
import { fakeItems, AdminRouter } from './testUtils';

describe('AdminPage', function () {

    let wrapper;

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    })

    it('stops poller on mount', function () {
        const poller = new Poller();
        poller.init(() => {});
        expect(poller.isPolling).toBe(true);
        wrapper = shallow(<AdminPage initialItems={fakeItems} poller={poller} />);
        console.log(`wrapper:`, wrapper);
        expect(poller.isPolling).toBe(false);
    });

    it('AdminHeader links back to /', function () {
        wrapper = mount(<AdminRouter><AdminHeader /></AdminRouter>);
        const link = wrapper.find('Link');
        expect(link.prop('to')).toBe('/');
    });

    it('warns user if they navigate away from unsaved changes', function () {
        const store = initStore();
        store.dispatch(fetchAuctionSuccess({ rawAuctionItems: fakeItems }));
        wrapper = mount(
            <Provider store={store}>
                <AdminRouter>
                    <ConnectedAdminPage />
                </AdminRouter>
            </Provider>
        )
        const title = wrapper.find('#title');
        const first = wrapper.find('.sidebar-item').at(0);
        const second = wrapper.find('.sidebar-item').at(1);

        expect(first.hasClass('focused')).toBe(true);
        expect(second.hasClass('focused')).toBe(false);
        expect(wrapper.find('.confirm-discard').length).toBe(0);

        title.prop('onChange')({target: {value: 'Foo'}});
        second.prop('onClick')();

        expect(first.hasClass('focused')).toBe(true);
        expect(second.hasClass('focused')).toBe(false);
        wrapper.update();
        expect(wrapper.find('.confirm-discard').length).toBe(1);
    });

    it.each`
    titleValue | descriptionValue | missingInfoLength
    ${''}      | ${''}            | ${1}
    ${' '}     | ${''}            | ${1}
    ${''}      | ${' '}           | ${1}
    ${' '}     | ${' '}           | ${1}
    ${'Foo'}   | ${' '}           | ${1}
    ${''}      | ${'Bar'}         | ${1}
    ${'Foo'}   | ${'Bar'}         | ${0}
    `('requires title and description to save | $titleValue | $descriptionValue',
    ({titleValue, descriptionValue, missingInfoLength}) => {
        const put = jest.fn().mockResolvedValue({data: {updatedItem: fakeItems[0]}});
        const store = initStore({ axios: { put }});
        store.dispatch(fetchAuctionSuccess({ rawAuctionItems: fakeItems }));
        wrapper = mount(
            <Provider store={store}>
                <AdminRouter>
                    <ConnectedAdminPage />
                </AdminRouter>
            </Provider>
        )
        const addItem = wrapper.find('.sidebar-add-item');

        expect(wrapper.find('.missing-info').length).toBe(0);

        addItem.prop('onClick')();
        wrapper.update();

        const title = wrapper.find('#title');
        const description = wrapper.find('#description');
        title.prop('onChange')({target: {value: titleValue}});
        description.prop('onChange')({target: {value: descriptionValue}});

        wrapper.update();
        wrapper.find('.save').prop('onClick')({preventDefault: jest.fn()});

        wrapper.update();
        expect(wrapper.find('.missing-info').length).toBe(missingInfoLength);
    });

    it.skip('title change updates sidebar', function () {
        
    });

    it.skip('calls submitChange on submit', function () {
        // TODO: test both button and enter
    });

    it.skip('handleInput on title, description, minBid change', function () {
        
    });

    it('clicking outside modal clears modal with no change', function () {
        const store = initStore();
        store.dispatch(fetchAuctionSuccess({ rawAuctionItems: fakeItems }));
        wrapper = mount(
            <Provider store={store}>
                <AdminRouter>
                    <ConnectedAdminPage />
                </AdminRouter>
            </Provider>
        )
        const title = wrapper.find('#title');
        const second = wrapper.find('.sidebar-item').at(1);

        // Change first item title
        title.prop('onChange')({target: {value: 'Foo'}});
        second.prop('onClick')();
        wrapper.update();
        expect(wrapper.find('.confirm-discard').length).toBe(1);

        wrapper.find('.modal-background').prop('onClick')({stopPropagation: jest.fn()});
        wrapper.update();
        expect(wrapper.find('.confirm-discard').length).toBe(0);
    });
});
