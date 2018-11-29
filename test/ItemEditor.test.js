import * as React from 'react';
import { shallow } from 'enzyme';
import { ItemEditor } from '../src/admin/ItemEditor';

describe('ItemEditor', function () {

    const onChangeDescription = jest.fn();
    const onChangeMinBid = jest.fn();
    const onChangeTitle = jest.fn();
    const onDelete = jest.fn();
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
        const itemEditor = shallow(<ItemEditor
            item={fakeItem}
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
            item={fakeItem} />);
        const field = itemEditor.find(`#${field}`);
        field.prop('onChange')({ target: { value: 'X' }});
        expect(func).toBeCalledWith({ target: { value: 'X' }});
    });

    it('calls onSubmit when user clicks save or hits enter', function () {
        const itemEditor = shallow(<ItemEditor
            onSubmit={onSubmit}
            item={fakeItem}
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

    it('calls onDelete when user clicks delete', function () {
        const itemEditor = shallow(<ItemEditor
            onDelete={onDelete}
            item={fakeItem}
        />);
        const deleteButton = itemEditor.find(`#delete`);
        expect(onDelete).toBeCalledTimes(0);
        deleteButton.prop('onClick')();
        expect(onDelete).toBeCalledTimes(1);
    });
});