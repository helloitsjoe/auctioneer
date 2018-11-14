import * as React from 'react';
import { shallow } from 'enzyme';
import { fakeItems } from './testUtils';
import { Sidebar, mapDispatchToProps } from '../src/admin/Sidebar';
import { SidebarItem } from '../src/admin/SidebarItem';
import { AddItem } from '../src/admin/AddItem';

describe('Sidebar', function() {
    const addItem = jest.fn();
    const itemFocus = jest.fn();

    const setup = propOverrides => {
        const props = {
            focusedIndex: 0,
            auctionItems: fakeItems,
            itemFocus,
            addItem,
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

    it('calls onItemClick when selected', function() {
        const { sidebar } = setup();

        const secondItem = sidebar.childAt(1);
        const addWrapper = sidebar.find('AddItem');
        expect(addItem).not.toBeCalled();
        expect(itemFocus).not.toBeCalled();

        secondItem.prop('onSelect')();
        expect(itemFocus).toBeCalledWith(1);
        expect(addItem).not.toBeCalled();
        jest.resetAllMocks();

        addWrapper.prop('onSelect')();
        expect(itemFocus).not.toBeCalled();
        expect(addItem).toBeCalledTimes(1);
    });

    it('AddItem calls onSelect when clicked', function() {
        const addItem = jest.fn();
        const wrapper = shallow(<AddItem onSelect={addItem} />);
        expect(wrapper.text()).toBe('+');
        expect(addItem).not.toBeCalled();
        wrapper.prop('onClick')();
        expect(addItem).toBeCalledTimes(1);
    });

    it('SidebarItem works as expected', function() {
        const [fakeItem] = fakeItems;
        const itemFocus = jest.fn();
        const sidebarItem = shallow(
            <SidebarItem
                itemData={fakeItem}
                focused={false}
                onSelect={itemFocus}
            />
        );
        expect(itemFocus).not.toBeCalled();
        sidebarItem.prop('onClick')();
        expect(itemFocus).toBeCalledTimes(1);
        expect(sidebarItem.text()).toBe(fakeItem.title);
        expect(sidebarItem.hasClass('focused')).toBe(false);
        sidebarItem.setProps({ focused: true });
        expect(sidebarItem.hasClass('focused')).toBe(true);
    });
});
