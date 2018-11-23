import * as React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { Poller } from '../src/Poller';
import App from '../src/App';
import ConnectedAdminPage from '../src/admin/AdminPage';
import { initStore } from '../src/store';
import { fetchAuctionSuccess } from '../src/actions/auctionItemActions';
import { fakeItems, AdminRouter } from './testUtils';
import { ConfirmDiscard } from '../src/admin/ConfirmDiscard';

describe('ConfirmDiscard', function () {

    let wrapper;

    afterEach(() => {
        wrapper.unmount();
    })

    it('key press calls handleCloseModal', function () {
        const eventMap = {};
        document.addEventListener = jest.fn((event, cb) => {
            eventMap[event] = cb;
        });
        const handleCloseModal = jest.fn();
        
        wrapper = mount(<ConfirmDiscard onCloseModal={handleCloseModal} />)

        expect(handleCloseModal).toBeCalledTimes(0);
        eventMap.keydown({key: 'Escape'});
        expect(handleCloseModal).toBeCalledTimes(1);
    });

    it('save changes', function () {
        wrapper = mount(<ConfirmDiscard onCloseModal={() => {}} />)
        const save = wrapper.find('.save');
        save.prop('onClick')();
        expect(onSubmitChanges).toBeCalledTimes(1);
    });

    it('discard changes', function () {
        wrapper = mount(<ConfirmDiscard onCloseModal={() => {}} />)
        const discard = wrapper.find('.discard-continue');
        discard.prop('onClick')();
        expect(onSubmitChanges).toBeCalledTimes(0);
    });
});
