import * as React from 'react';
import { shallow } from 'enzyme';
import { Poller } from '../src/Poller';
import { BidsPage } from '../src/user/BidsPage';

describe('BidsPage', function () {

    it('starts poller on mount', function () {
        const poller = new Poller();
        expect(poller.isPolling).toBe(false);
        const bidsPage = shallow(<BidsPage poller={poller} auctionItems={[]} filter={false} user="Foo" />);
        expect(poller.isPolling).toBe(true);
        bidsPage.unmount();
        poller.stop();
    });
});
