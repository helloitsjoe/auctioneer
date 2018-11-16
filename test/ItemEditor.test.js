import * as React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import ConnectedItemEditor, { ItemEditor } from '../src/admin/ItemEditor';
import { initStore } from '../src/store';
import { fetchAuctionSuccess } from '../src/actions/auctionItemActions';
import { fakeItems, wait } from './testUtils';

describe('ItemEditor', function () {

    const onChangeTitle = jest.fn();
    const deleteRequest = jest.fn();
    const submitChange = jest.fn();

    const fakeItem = {
        id: 'FakeID',
        title: 'Blah',
        description: 'Blah blah blah',
        bids: [{ name: 'min', value: 42 }]
    }

    let itemEditor;

    beforeEach(() => {
        itemEditor = shallow(<ItemEditor
            initialItemData={fakeItem}
            onChangeTitle={onChangeTitle}
            submitChange={submitChange}
            deleteRequest={deleteRequest}
        />);
    });

    afterEach(() => {
        itemEditor.unmount();
        jest.resetAllMocks();
    });
    
    it.each([
        ['title', 'Blah'],
        ['description', 'Blah blah blah'],
        ['minimum', 42],
    ])(`display itemData %s`, function (field, expected) {
        const field = itemEditor.find(`#${field}`);
        expect(field.prop('value')).toBe(expected);
    });

    it(`call onChangeTitle`, function () {
        const title = itemEditor.find(`#title`);
        title.prop('onChange')({ target: { value: 'X' }});
        expect(onChangeTitle).toBeCalledWith({ target: { value: 'X' }});
    });

    it('minBid input updates minBid', function () {
        const minBid = itemEditor.find(`#minimum`);
        expect(minBid.prop('value')).toBe(fakeItem.bids[0].value);
        minBid.prop('onChange')({ target: { value: 8 }});
        itemEditor.update();
        const minBidAfter = itemEditor.find(`#minimum`);
        expect(minBidAfter.prop('value')).toBe(8);
    });

    it('description input updates description', function () {
        const description = itemEditor.find(`#description`);
        expect(description.prop('value')).toBe(fakeItem.description);
        description.prop('onChange')({ target: { value: 'Changed!' }});
        itemEditor.update();
        const descriptionAfter = itemEditor.find(`#description`);
        expect(descriptionAfter.prop('value')).toBe('Changed!');
    });

    it('save disabled until user changes input', function () {
        // test click
        // test enter
    });

    it('calls submitChange when user clicks save or hits enter', function () {
        const saveButton = itemEditor.find(`#submit`);
        saveButton.prop('onClick')({ preventDefault: () => {} });
        expect(submitChange).toBeCalledTimes(1);
        jest.clearAllMocks();
        expect(submitChange).not.toBeCalled();
        const form = itemEditor.find(`form`);
        form.prop('onSubmit')({ preventDefault: () => {} });
        expect(submitChange).toBeCalledTimes(1);
    });

    it('calls deleteRequest when user clicks delete', function () {
        const deleteButton = itemEditor.find(`#delete`);
        deleteButton.prop('onClick')();
        expect(deleteRequest).toBeCalledWith('FakeID');
    });

    it('item changes when user clicks delete', async function () {
        const [itemToDelete] = fakeItems;
        const moxios = {
            delete: jest.fn().mockResolvedValue({ data: { deletedItemID: itemToDelete.id }}),
        };
        const store = initStore({ axios: moxios });
        store.dispatch(fetchAuctionSuccess({ rawAuctionItems: fakeItems }));
        const wrapper = mount(
            <Provider store={store}>
                <ConnectedItemEditor />
            </Provider>
        );
        const title = wrapper.find('#title');
        expect(store.getState().auctionItems.length).toBe(fakeItems.length);
        expect(title.html()).toMatch(itemToDelete.title);
        const deleteButton = wrapper.find('#delete');
        deleteButton.prop('onClick')();
        // Allow delete request to come back
        await wait();
        expect(store.getState().auctionItems.length).toBe(fakeItems.length - 1);
        expect(title.html()).not.toMatch(itemToDelete.title);
        wrapper.unmount();
    });
});