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
        console.log(`wrapper:`, wrapper);
        expect(poller.isPolling).toBe(false);
    });

    it('AdminHeader links back to /', function () {
        const link = wrapper.find('Link');
        expect(link.prop('to')).toBe('/');
    });

    it.skip('calls submitChange on submit', function () {
        // TODO: test both button and enter
    });

    it.skip('save is disabled if no changes', function () {
        // TODO: test both button and enter
    });

    it.skip('calls deleteRequest on delete', function () {
        // TODO: test that it's called with FakeID
    });

    it('confirm discard if navigating away from unsaved changes', function () {
        expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(true);
        expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(false);
        expect(wrapper.find('.confirm-discard').length).toBe(0);

        title.prop('onChange')({target: {value: 'Foo'}});
        wrapper.find('SidebarItem').at(1).prop('onSelect')();

        wrapper.update();
        // Focus should not change
        expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(true);
        expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(false);
        expect(wrapper.find('.confirm-discard').length).toBe(1);
    });

    it('clicking outside modal clears modal with no change', function () {
        const second = wrapper.find('SidebarItem').at(1);

        // Change first item title
        title.prop('onChange')({target: {value: 'Foo'}});
        second.prop('onSelect')();
        
        wrapper.update();
        expect(wrapper.find('.confirm-discard').length).toBe(1);
        wrapper.find('.modal-background').prop('onClick')({stopPropagation: jest.fn()});
        
        wrapper.update();
        expect(wrapper.find('.confirm-discard').length).toBe(0);
        // Focus should not change
        expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(true);
        expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(false);
    });

    it('select item', function () {
        expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(true);
        expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(false);
        wrapper.find('SidebarItem').at(1).prop('onSelect')();
        wrapper.update();
        expect(wrapper.find('SidebarItem').at(0).prop('focused')).toBe(false);
        expect(wrapper.find('SidebarItem').at(1).prop('focused')).toBe(true);
    });

    it('delete removes item', function () {
        const [firstItem, secondItem] = fakeItems;
        expect(wrapper.find('SidebarItem').length).toBe(fakeItems.length);
        expect(wrapper.find('SidebarItem').first().prop('title')).toBe(firstItem.title);
        expect(wrapper.find('#title').prop('value')).toBe(firstItem.title);
        wrapper.find('#delete').prop('onClick')();
        wrapper.update();
        expect(wrapper.find('SidebarItem').length).toBe(fakeItems.length - 1);
        expect(wrapper.find('SidebarItem').first().prop('title')).toBe(secondItem.title);
        expect(wrapper.find('#title').prop('value')).toBe(secondItem.title);
    });

    it.skip('deleting last item replaces item with blank item', function () {

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
        expect(wrapper.find('.missing-info').length).toBe(0);

        wrapper.find('AddItem').prop('onSelect')();
        wrapper.update();

        wrapper.find('#title').prop('onChange')({target: {value: titleValue}});
        wrapper.find('#description').prop('onChange')({target: {value: descriptionValue}});
        wrapper.find('.save').prop('onClick')({preventDefault: jest.fn()});

        wrapper.update();
        // expect(submitChange).not.toBeCalled();
        expect(wrapper.find('.missing-info').length).toBe(missingInfoLength);
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
            const id = wrapper.find('SidebarItem').last().prop('id');
            wrapper.find('SidebarItem').first().prop('onSelect')();
            wrapper.update();
            expect(wrapper.find('SidebarItem').first().prop('focused')).toBe(true);
            wrapper.find('AddItem').prop('onSelect')();
            wrapper.update();
            const sidebarItems = wrapper.find('SidebarItem');
            expect(sidebarItems.length).toBe(fakeItems.length + 1);
            expect(sidebarItems.last().prop('id')).toBe(id);
            expect(sidebarItems.last().prop('focused')).toBe(true);
        });

        it.skip('can add after deleting', function () {
            
        });
    });
});
