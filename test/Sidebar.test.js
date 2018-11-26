import * as React from 'react';
import { shallow } from 'enzyme';
import { fakeItems } from './testUtils';
import { Sidebar } from '../src/admin/Sidebar';
import { SidebarItem } from '../src/admin/SidebarItem';
import { AddItem } from '../src/admin/AddItem';

describe('Sidebar', function() {
    const onAddItem = jest.fn();
    const onItemFocus = jest.fn();

    const setup = propOverrides => {
        const props = {
            focusedIndex: 0,
            items: fakeItems,
            onItemFocus,
            onAddItem,
            ...propOverrides,
        };

        const sidebar = shallow(<Sidebar {...props} />);

        return { sidebar };
    };

    it('shows items and add button', function() {
        const { sidebar } = setup();
        expect(sidebar.childAt(0).name()).toBe('SidebarItem');
        expect(sidebar.childAt(1).name()).toBe('SidebarItem');
        expect(sidebar.childAt(2).name()).toBe('AddItem');
    });

    it('passes props to SidebarItems', function() {
        const { sidebar } = setup();
        const sidebarItems = sidebar.find('SidebarItem');
        expect(sidebarItems).toHaveLength(2);
        expect(sidebarItems.at(0).prop('itemData')).toEqual(fakeItems[0]);
        expect(sidebarItems.at(1).prop('itemData')).toEqual(fakeItems[1]);
        expect(sidebarItems.at(0).prop('focused')).toBe(true);
        expect(sidebarItems.at(1).prop('focused')).toBe(false);
    });

    it.skip('focused SidebarItem title is temp title', function () {
        
    });

    it.skip('non-focused SidebarItem is item title', function () {
        
    });

    it('calls onItemClick when selected', function() {
        const { sidebar } = setup();

        const secondItem = sidebar.childAt(1);
        const addWrapper = sidebar.find('AddItem');
        expect(onAddItem).not.toBeCalled();
        expect(onItemFocus).not.toBeCalled();

        secondItem.prop('onSelect')();
        expect(onItemFocus).toBeCalledWith(1);
        expect(onAddItem).not.toBeCalled();
        jest.resetAllMocks();

        addWrapper.prop('onSelect')();
        expect(onItemFocus).not.toBeCalled();
        expect(onAddItem).toBeCalledTimes(1);
    });

    it('AddItem calls onItemFocus when clicked', function() {
        const onAddItem = jest.fn();
        const wrapper = shallow(<AddItem onSelect={onAddItem} />);
        expect(wrapper.text()).toBe('+');
        expect(onAddItem).not.toBeCalled();
        wrapper.prop('onClick')();
        expect(onAddItem).toBeCalledTimes(1);
    });

    it('SidebarItem works as expected', function() {
        const [fakeItem] = fakeItems;
        const onItemFocus = jest.fn();
        const sidebarItem = shallow(
            <SidebarItem
                title={fakeItem.title}
                focused={false}
                onSelect={onItemFocus}
            />
        );
        expect(onItemFocus).not.toBeCalled();
        sidebarItem.prop('onClick')();
        expect(onItemFocus).toBeCalledTimes(1);
        expect(sidebarItem.text()).toBe(fakeItem.title);
        expect(sidebarItem.hasClass('focused')).toBe(false);
        sidebarItem.setProps({ focused: true });
        expect(sidebarItem.hasClass('focused')).toBe(true);
    });
});
