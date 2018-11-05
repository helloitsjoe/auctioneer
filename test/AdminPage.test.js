import * as React from 'react';
import { shallow } from 'enzyme';
import { Poller } from '../src/Poller';
import { AdminPage } from '../src/admin/AdminPage';

describe('AdminPage', function () {

    it('starts poller on mount', function () {
        const poller = new Poller();
        poller.init(() => {});
        expect(poller.isPolling).toBe(true);
        shallow(<AdminPage poller={poller} />);
        expect(poller.isPolling).toBe(false);
    });
});
