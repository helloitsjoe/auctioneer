import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Poller } from '../src/Poller';
import {AdminPage} from '../src/admin/AdminPage';
import { fakeItems, AdminRouter } from './testUtils';
import { getMinBidValue } from '../src/utils';

describe('AdminPage', function () {

    const submitChange = jest.fn();
    const deleteRequest = jest.fn();
    let wrapper;
    let title;
    let description;
    let minBid;

    beforeEach(() => {
        wrapper = mount(
            <AdminRouter>
                <AdminPage
                    initialItems={fakeItems}
                    submitChange={submitChange}
                    deleteRequest={deleteRequest}
                />
            </AdminRouter>
        );
        title = wrapper.find('#title');
        minBid = wrapper.find('#minimum');
        description = wrapper.find('#description');
        expect(title.prop('value')).toBe(fakeItems[0].title);
        expect(minBid.prop('value')).toBe(getMinBidValue(fakeItems[0].bids));
        expect(description.prop('value')).toBe(fakeItems[0].description);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    })

    it('stops poller on mount', function () {
        const poller = new Poller();
        poller.init(() => {});
        expect(poller.isPolling).toBe(true);
        wrapper = shallow(<AdminPage initialItems={fakeItems} poller={poller} />);
        expect(poller.isPolling).toBe(false);
    });

    it('AdminHeader links back to /', function () {
        const link = wrapper.find('Link');
        expect(link.prop('to')).toBe('/');
    });

    it('calls submitChange on submit', function () {
        expect(submitChange).toBeCalledTimes(0);
        wrapper.find('.save').prop('onClick')({ preventDefault: jest.fn() });
        expect(submitChange).toBeCalledTimes(1);
    });

    it.skip('save is disabled if no changes', function () {
        // TODO: test both button and enter
    });

    it('calls deleteRequest on delete', function () {
        expect(deleteRequest).not.toBeCalled();
        wrapper.find('#delete').prop('onClick')();
        expect(deleteRequest).toBeCalledWith(0);
    });

    it('select item', function () {
        expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(true);
        expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(false);
        wrapper.find('SidebarItem').at(1).prop('onSelect')();
        const sidebarItems = wrapper.update().find('SidebarItem');
        // Focus should switch to 2nd item
        expect(sidebarItems.at(0).prop('focused')).toBe(false);
        expect(sidebarItems.at(1).prop('focused')).toBe(true);
        // Sidebar items should have same titles as before select
        expect(sidebarItems.at(0).text()).toBe(fakeItems[0].title);
        expect(sidebarItems.at(1).text()).toBe(fakeItems[1].title);
        // Item editor should have info from 2nd item
        expect(wrapper.find('#title').prop('value')).toBe(fakeItems[1].title);
        expect(wrapper.find('#description').prop('value')).toBe(fakeItems[1].description);
    });

    it('delete removes item', function () {
        const [firstItem, secondItem] = fakeItems;
        expect(wrapper.find('SidebarItem').length).toBe(fakeItems.length);
        expect(wrapper.find('SidebarItem').at(0).text()).toBe(firstItem.title);
        expect(wrapper.find('#title').prop('value')).toBe(firstItem.title);
        wrapper.find('#delete').prop('onClick')();
        wrapper.update();
        expect(wrapper.find('SidebarItem').length).toBe(fakeItems.length - 1);
        expect(wrapper.find('SidebarItem').at(0).text()).toBe(secondItem.title);
        expect(wrapper.find('#title').prop('value')).toBe(secondItem.title);
    });

    it('can add after deleting', function () {
        wrapper.find('#delete').prop('onClick')();
        wrapper.update();

        expect(wrapper.find('SidebarItem').length).toBe(fakeItems.length - 1);
        wrapper.find('AddItem').prop('onSelect')();
        wrapper.update();

        expect(wrapper.find('SidebarItem').length).toBe(fakeItems.length);
        expect(wrapper.find('SidebarItem').last().text()).toBe('');
        expect(wrapper.find('#title').prop('value')).toBe('');
    });

    it('deleting last item replaces item with blank item', function () {
        const [firstItem] = fakeItems;
        wrapper = mount(
            <AdminRouter>
                <AdminPage
                    initialItems={[firstItem]}
                    deleteRequest={deleteRequest}
                ></AdminPage>
            </AdminRouter>
        )
        expect(wrapper.find('SidebarItem').length).toBe(1);
        expect(wrapper.find('SidebarItem').text()).toBe(firstItem.title);
        expect(wrapper.find('#title').prop('value')).toBe(firstItem.title);
        wrapper.find('#delete').prop('onClick')();
        wrapper.update();
        expect(wrapper.find('SidebarItem').length).toBe(1);
        expect(wrapper.find('SidebarItem').text()).toBe('');
        expect(wrapper.find('#title').prop('value')).toBe('');
    });

    it.each`
    titleValue | descriptionValue | modalLength | callCount
    ${''}      | ${''}            | ${1}              | ${0}
    ${' '}     | ${''}            | ${1}              | ${0}
    ${''}      | ${' '}           | ${1}              | ${0}
    ${' '}     | ${' '}           | ${1}              | ${0}
    ${'Foo'}   | ${' '}           | ${1}              | ${0}
    ${''}      | ${'Bar'}         | ${1}              | ${0}
    ${'Foo'}   | ${'Bar'}         | ${0}              | ${1}
    `('requires title and description to save | $titleValue | $descriptionValue',
    ({titleValue, descriptionValue, modalLength, callCount}) => {
        expect(wrapper.find('.missing-info').length).toBe(0);

        wrapper.find('AddItem').prop('onSelect')();
        wrapper.update();

        wrapper.find('#title').prop('onChange')({target: {value: titleValue}});
        wrapper.find('#description').prop('onChange')({target: {value: descriptionValue}});
        wrapper.find('.save').prop('onClick')({preventDefault: jest.fn()});
        wrapper.update();

        expect(submitChange).toBeCalledTimes(callCount);
        expect(wrapper.find('.missing-info').length).toBe(modalLength);
    });

    describe('input change', function () {
        
        it('change title', function () {
            title.prop('onChange')({target: {value: 'Hello there'}});
            expect(wrapper.update().find('#title').prop('value')).toBe('Hello there');
        });
    
        it('change description', function () {
            description.prop('onChange')({target: {value: 'New description'}});
            expect(wrapper.update().find('#description').prop('value')).toBe('New description');
        });
    
        it('change minBid', function () {
            minBid.prop('onChange')({target: {value: '600' }});
            expect(wrapper.update().find('#minimum').prop('value')).toBe(600);
        });
    
        it('title change updates sidebar', function () {
            expect(wrapper.find('SidebarItem').at(0).text()).toBe(fakeItems[0].title);    
            wrapper.find('#title').prop('onChange')({target: {value: 'Hello there'}});
            expect(wrapper.find('SidebarItem').at(0).text()).toBe('Hello there');
        });
    });

    describe('addItem', function () {

        beforeEach(() => {
            expect(wrapper.find('SidebarItem').length).toBe(fakeItems.length);
            wrapper.find('AddItem').prop('onSelect')();
            wrapper.update();
        });
        
        it('adds item to sidebar', function () {
            const sidebarItems = wrapper.find('SidebarItem');
            expect(sidebarItems.length).toBe(fakeItems.length + 1);
            expect(sidebarItems.last().text()).toBe('');
            expect(sidebarItems.last().prop('focused')).toBe(true);
        });

        it('new item in item editor', function () {
            expect(wrapper.find('#title').prop('value')).toBe('');
        });

        it('noop if current item has no title', function () {
            const id = wrapper.find('SidebarItem').last().prop('id');
            wrapper.find('AddItem').prop('onSelect')();
            wrapper.update();
            const sidebarItems = wrapper.find('SidebarItem');
            expect(sidebarItems.length).toBe(fakeItems.length + 1);
            expect(sidebarItems.last().prop('id')).toBe(id);
        });

        it('select new item if one exists', function () {
            wrapper.find('SidebarItem').first().prop('onSelect')();
            wrapper.update();
            expect(wrapper.find('SidebarItem').first().prop('focused')).toBe(true);
            wrapper.find('AddItem').prop('onSelect')();
            wrapper.update();
            const sidebarItems = wrapper.find('SidebarItem');
            expect(sidebarItems.length).toBe(fakeItems.length + 1);
            expect(sidebarItems.last().text()).toBe('');
            expect(sidebarItems.last().prop('focused')).toBe(true);
        });
    });

    describe('confirm discard if navigating away from unsaved changes', function () {

        beforeEach(() => {
            expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(true);
            expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(false);
            expect(wrapper.find('.confirm-discard').length).toBe(0);

            // Change first item title
            title.prop('onChange')({target: {value: 'Foo'}});
            // Select second item
            wrapper.find('SidebarItem').at(1).prop('onSelect')();

            expect(wrapper.update().find('.confirm-discard').length).toBe(1);
        });
        
        it('focus should not change', function () {
            expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(true);
            expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(false);
        });
    
        it('clicking outside modal clears modal with no change', function () {
            wrapper.find('.modal-background').prop('onClick')({});
            wrapper.update();
            
            expect(wrapper.find('.confirm-discard').length).toBe(0);
            // Focus should not change after modal is cleared
            expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(true);
            expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(false);
        });
    
        it('save saves changes, allows focus on new item', function () {
            expect(submitChange).toBeCalledTimes(0);
            wrapper.find('.confirm-save').prop('onClick')({});
            expect(submitChange).toBeCalledTimes(1);
            wrapper.update();

            expect(wrapper.find('.confirm-discard').length).toBe(0);
            // Focus should not change
            expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(true);
            expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(false);

            // Title should be changed
            expect(wrapper.find('SidebarItem').at(0).text()).toBe('Foo');
            // Select second item
            wrapper.find('SidebarItem').at(1).prop('onSelect')();
            wrapper.update();
            
            expect(wrapper.find('.confirm-discard').length).toBe(0);
            expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(false);
            expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(true);
        });
    
        it('discard reverts changes, allows focus on other items', function () {
            wrapper.find('.discard').prop('onClick')({});
            wrapper.update();

            expect(wrapper.find('.confirm-discard').length).toBe(0);
            // Focus should not change
            expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(true);
            expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(false);

            // Title should NOT be changed
            expect(wrapper.find('SidebarItem').at(0).text()).toBe(fakeItems[0].title);
            // Select second item
            wrapper.find('SidebarItem').at(1).prop('onSelect')();
            wrapper.update();
            
            expect(wrapper.find('.confirm-discard').length).toBe(0);
            expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(false);
            expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(true);
        });    
    });
});
