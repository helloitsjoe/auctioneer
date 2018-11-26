import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { getHighBid, getMinBidValue } from '../src/utils';
import { fakeItems } from './testUtils';
import { ItemEditor, InputKey, mergeProps } from '../src/admin/ItemEditor';

describe('ItemEditor', function () {

    const onChangeDescription = jest.fn();
    const onChangeMinBid = jest.fn();
    const onChangeTitle = jest.fn();
    const deleteRequest = jest.fn();
    const onSubmit = jest.fn();

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
        const { title, description, bids } = fakeItem;
        const itemEditor = shallow(<ItemEditor
            title={title}
            description={description}
            minBid={getMinBidValue(bids)}
        />);
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

    it('save disabled until user changes input', function () {
        // test click
        // test enter
    });

    it('calls onSubmit when user clicks save or hits enter', function () {
        const itemEditor = shallow(<ItemEditor
            onSubmit={onSubmit}
            title="Foo"
            description="Bar"
            minBid={45}
        />);
        const saveButton = itemEditor.find(`#submit`);
        saveButton.prop('onClick')();
        expect(onSubmit).toBeCalledTimes(1);
        jest.clearAllMocks();
        expect(onSubmit).not.toBeCalled();
        const form = itemEditor.find(`form`);
        form.prop('onSubmit')();
        expect(onSubmit).toBeCalledTimes(1);
    });

    it.skip('calls onChangeTitle', function () {
        
    });

    it.skip('calls onChangeMinBid', function () {
        
    });

    it.skip('calls onChangeDescription', function () {
        
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

    // it('mergeProps', function () {
    //     const preventDefault = jest.fn();
    //     const inputChange = jest.fn();
    //     const itemData = fakeItem;

    //     const stateProps = { itemData };
    //     const dispatchProps = {
    //         deleteRequest,
    //         inputChange,
    //         submitChange,
    //     }
    //     const {
    //         onChangeDescription,
    //         onSubmitChanges,
    //         onChangeMinBid,
    //         onChangeTitle,
    //         ...rest
    //     } = mergeProps(stateProps, dispatchProps);

    //     expect(rest).toEqual({ itemData, deleteRequest });
    //     expect(preventDefault).not.toBeCalled();
    //     expect(inputChange).not.toBeCalled();
    //     expect(submitChange).not.toBeCalled();

    //     const e = { preventDefault, target: { value: 'Bla' }};
    //     onSubmitChanges(e);
    //     expect(preventDefault).toBeCalledTimes(1);
    //     expect(submitChange).toBeCalledTimes(1);

    //     onChangeDescription(e);
    //     onChangeMinBid(e);
    //     onChangeTitle(e);
    //     expect(inputChange).toBeCalledTimes(3);
    //     expect(inputChange).toBeCalledWith('Bla', InputKey.title);
    //     expect(inputChange).toBeCalledWith('Bla', InputKey.minBid);
    //     expect(inputChange).toBeCalledWith('Bla', InputKey.description);
    // });
});