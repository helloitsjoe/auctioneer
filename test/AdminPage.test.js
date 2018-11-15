import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Poller } from '../src/Poller';
import { BrowserRouter as Router } from 'react-router-dom';
import { AdminPage } from '../src/admin/AdminPage';
import { AdminHeader } from '../src/admin/AdminHeader';

describe('AdminPage', function () {

    it('stops poller on mount', function () {
        const poller = new Poller();
        poller.init(() => {});
        expect(poller.isPolling).toBe(true);
        shallow(<AdminPage poller={poller} />);
        expect(poller.isPolling).toBe(false);
    });

    it('AdminHeader links back to /', function () {
        const header = mount(<Router><AdminHeader /></Router>);
        const link = header.find('Link');
        expect(link.prop('to')).toBe('/');
    });
});
