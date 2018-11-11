import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { getHighBid } from '../src/utils';
import { fakeItems } from './testUtils';
import { ItemEditor, InputKey, mergeProps } from '../src/admin/ItemEditor';

describe('ItemEditor', function () {

    const onChangeDescription = jest.fn();
    const onSubmitChanges = jest.fn();
    const onChangeMinBid = jest.fn();
    const onChangeTitle = jest.fn();
    const deleteRequest = jest.fn();
    const putRequest = jest.fn();

    const fakeItem = {
        id: 'FakeID',
        title: 'Blah',
        description: 'Blah blah blah',
        bids: [{ name: 'min', value: 42 }]
    }
    
    it.each([
        ['title', 'Blah'],
        ['description', 'Blah blah blah'],
        ['minimum', 42],
    ])(`display itemData %s`, function (field, expected) {
        const itemEditor = shallow(<ItemEditor itemData={fakeItem} />);
        const field = itemEditor.find(`#${field}`);
        expect(field.prop('value')).toBe(expected);
    });

    it.each([
        ['title', onChangeTitle],
        ['description', onChangeDescription],
        ['minimum', onChangeMinBid],
    ])(`call %s on change`, function (field, func) {
        const itemEditor = shallow(<ItemEditor
            onChangeTitle={onChangeTitle}
            onChangeDescription={onChangeDescription}
            onChangeMinBid={onChangeMinBid}
            itemData={fakeItem} />);
        const field = itemEditor.find(`#${field}`);
        field.prop('onChange')({ target: { value: 'X' }});
        expect(func).toBeCalledWith({ target: { value: 'X' }});
    });

    it('calls onSubmitChanges when user clicks save or hits enter', function () {
        const putRequest = jest.fn();
        const itemEditor = shallow(<ItemEditor
            onSubmitChanges={onSubmitChanges}
            putRequest={putRequest}
            itemData={fakeItem}
        />);
        const saveButton = itemEditor.find(`#submit`);
        saveButton.prop('onClick')();
        expect(onSubmitChanges).toBeCalledTimes(1);
        jest.clearAllMocks();
        expect(onSubmitChanges).not.toBeCalled();
        const form = itemEditor.find(`form`);
        form.prop('onSubmit')();
        expect(onSubmitChanges).toBeCalledTimes(1);
    });

    it('calls deleteRequest when user clicks delete', function () {
        const itemEditor = shallow(<ItemEditor
            deleteRequest={deleteRequest}
            itemData={fakeItem}
        />);
        const deleteButton = itemEditor.find(`#delete`);
        deleteButton.prop('onClick')();
        expect(deleteRequest).toBeCalledWith('FakeID');
    });

    it('mergeProps', function () {
        const preventDefault = jest.fn();
        const inputChange = jest.fn();
        const itemData = fakeItem;

        const stateProps = { itemData };
        const dispatchProps = {
            deleteRequest,
            inputChange,
            putRequest,
        }
        const {
            onChangeDescription,
            onSubmitChanges,
            onChangeMinBid,
            onChangeTitle,
            ...rest
        } = mergeProps(stateProps, dispatchProps);

        expect(rest).toEqual({ itemData, deleteRequest });
        expect(preventDefault).not.toBeCalled();
        expect(inputChange).not.toBeCalled();
        expect(putRequest).not.toBeCalled();

        const e = { preventDefault, target: { value: 'Bla' }};
        onSubmitChanges(e);
        expect(preventDefault).toBeCalledTimes(1);
        expect(putRequest).toBeCalledTimes(1);

        onChangeDescription(e);
        onChangeMinBid(e);
        onChangeTitle(e);
        expect(inputChange).toBeCalledTimes(3);
        expect(inputChange).toBeCalledWith('Bla', InputKey.title);
        expect(inputChange).toBeCalledWith('Bla', InputKey.minBid);
        expect(inputChange).toBeCalledWith('Bla', InputKey.description);
    });
});