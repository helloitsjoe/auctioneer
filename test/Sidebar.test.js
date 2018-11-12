import * as React from 'react';
import { shallow } from 'enzyme';
import { fakeItems } from './testUtils';
import { Sidebar, mapDispatchToProps } from '../src/admin/Sidebar';
import { SidebarItem } from '../src/admin/SidebarItem';
import { AddItem } from '../src/admin/AddItem';

describe('Sidebar', function () {

    const addItem = jest.fn();
    const itemFocus = jest.fn();

    const setup = (propOverrides) => {

        const props = {
            focusedIndex: 0,
            auctionItems: fakeItems,
            itemFocus,
            addItem,
            ...propOverrides
        }

        const sidebar = shallow(<Sidebar {...props}/>);

        return { sidebar };
    }

    it('shows items and add button', function () {
        const { sidebar } = setup();
        expect(sidebar.childAt(0).name()).toBe('SidebarItem');
        expect(sidebar.childAt(1).name()).toBe('SidebarItem');
        expect(sidebar.childAt(2).name()).toBe('AddItem');
    });

    it('passes props to SidebarItems', function () {
        const { sidebar } = setup();
        const sidebarItems = sidebar.find('SidebarItem');
        expect(sidebarItems).toHaveLength(2);
        expect(sidebarItems.get(0).props.itemData).toEqual(fakeItems[0]);
        expect(sidebarItems.get(1).props.itemData).toEqual(fakeItems[1]);
        expect(sidebarItems.get(0).props.focused).toBe(true);
        expect(sidebarItems.get(1).props.focused).toBe(false);
    });

    it('calls onItemClick when selected', function () {
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

    it('AddItem works as expected', function () {
        const onSelect = jest.fn();
        const addItem = shallow(<AddItem onSelect={onSelect} />);
        expect(onSelect).not.toBeCalled();
        addItem.prop('onClick')();
        expect(onSelect).toBeCalledTimes(1);
        expect(addItem.html()).toMatchSnapshot();
    });

    it('SidebarItem works as expected', function () {
        const onSelect = jest.fn();
        const sidebarItem = shallow(
            <SidebarItem
                itemData={fakeItems[0]}
                focused={false}
                onSelect={onSelect}
            />
        );
        expect(onSelect).not.toBeCalled();
        sidebarItem.prop('onClick')();
        expect(onSelect).toBeCalledTimes(1);
        expect(sidebarItem.html()).toMatchSnapshot();
        expect(sidebarItem.hasClass('focused')).toBe(false);
        sidebarItem.setProps({ focused: true });
        expect(sidebarItem.hasClass('focused')).toBe(true);
    });
});
