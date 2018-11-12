import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Poller } from '../src/Poller';
import { BrowserRouter as Router } from 'react-router-dom';
import { AdminPage } from '../src/admin/AdminPage';
import { AdminHeader } from '../src/admin/AdminHeader';

const moxios = {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}

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

    it('AdminHeader links back to /', function () {
        const header = mount(<Router><AdminHeader /></Router>);
        const link = header.find('Link');
        expect(link.prop('to')).toBe('/');
    });
});
