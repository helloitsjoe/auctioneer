import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { initStore } from '../src/store';
import { Poller } from '../src/Poller';
import { AdminPage } from '../src/admin/AdminPage';
import { Sidebar } from '../src/admin/Sidebar';
import { SidebarItem } from '../src/admin/SidebarItem';
import { AddItem } from '../src/admin/AddItem';

const moxios = {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}

const fakeItems = [{
    id: 0,
    title: 'Donovan\'s Greatest Hits',
    description: 'Includes Barabbajaggle of course',
    bids: [{value: 30000, name: 'min'}],
},{
    id: 2,
    title: 'A Very Donovan Christmas',
    description: 'And a Happy New Year',
    bids: [{value: 40000, name: 'min'}]
}];

// const setup = () => {
//     const poller = new Poller();
//     poller.init(() => {});

//     const store = initStore({ axios: moxios });

//     const adminWrap = mount(
//         <Provider store={store}>
//             <Router>
//                 <AdminPage poller={poller}/>
//             </Router>
//         </Provider>
//     );
    
//     return { adminWrap, poller };
// }

describe('AdminPage', function () {

    it('stops poller on mount', function () {
        const poller = new Poller();
        poller.init(() => {});
        expect(poller.isPolling).toBe(true);
        shallow(<AdminPage poller={poller} />);
        expect(poller.isPolling).toBe(false);
    });

    // it('display admin page', function () {
    //     const { adminWrap } = setup();
    //     expect(adminWrap.html()).toMatchSnapshot();
    // });

    describe('Sidebar', function () {

        const onItemClick = jest.fn();

        const setup = (propOverrides) => {

            const props = {
                focusedIndex: 0,
                auctionItems: fakeItems,
                onItemClick,
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
            const addItem = sidebar.find('AddItem');
            expect(onItemClick).not.toBeCalled();

            secondItem.simulate('select');
            expect(onItemClick).toBeCalledWith(1);

            addItem.simulate('select');
            expect(onItemClick).toBeCalledWith(null);
        });

        it('AddItem works as expected', function () {
            const onSelect = jest.fn();
            const addItem = shallow(<AddItem onSelect={onSelect} />);
            expect(onSelect).not.toBeCalled();
            addItem.simulate('click');
            expect(onSelect).toBeCalled();
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
            sidebarItem.simulate('click');
            expect(onSelect).toBeCalled();
            expect(sidebarItem.html()).toMatchSnapshot();
            expect(sidebarItem.hasClass('focused')).toBe(false);
            sidebarItem.setProps({ focused: true });
            expect(sidebarItem.hasClass('focused')).toBe(true);
        });
    });
});
