import * as React from 'react';
import { mount } from 'enzyme';
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
        const onSaveChanges = jest.fn();
        wrapper = mount(<ConfirmDiscard
            onSaveChanges={onSaveChanges}
            onCloseModal={() => {}} />)
        const save = wrapper.find('.confirm-save');
        save.prop('onClick')();
        expect(onSaveChanges).toBeCalledTimes(1);
    });

    it('discard changes', function () {
        const onDiscardChanges = jest.fn();
        wrapper = mount(<ConfirmDiscard
            onDiscardChanges={onDiscardChanges}
            onCloseModal={() => {}} />)
        const discard = wrapper.find('.discard');
        discard.prop('onClick')();
        expect(onDiscardChanges).toBeCalledTimes(1);
    });
});
