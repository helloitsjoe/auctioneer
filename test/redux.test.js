import { initStore } from "../src/store";
import { addItem, itemFocus, deleteItemSuccess, inputChange, submitChangeSuccess } from "../src/actions/adminActions";
import { toggleDescription,
    quickBid,
    fetchAuctionError,
    fetchAuctionSuccess } from "../src/actions/auctionItemActions";
import { TESTER_1 } from "./testUtils";
import { BID_INCREMENT,
    selectAuctionItems,
    selectFocusedIndex,
    selectIsLoaded,
    selectError,
    selectItem, 
    selectFirstItem} from "../src/reducers";
import { InputKey } from "../src/admin/ItemEditor";

describe("redux duck tests", () => {

    const initialState = {
        auctionItems: [],
        error: null,
        isLoaded: false,
        focusedIndex: 0,
        userTotal: 0
    }

    const newItem = {
        id: 0,
        title: '',
        bids: [{name: 'min', value: 0}],
        description: '',
        viewDetails: false
    };

    let getState;
    let dispatch;

    beforeEach(() => {
        const store = initStore({});
        getState = store.getState;
        dispatch = store.dispatch;
    });

    afterEach(() => {
        // moxios.put.mockClear();
    });

    it("initial state", function () {
        expect(getState()).toEqual(initialState);
    });

    describe('Admin', function () {

        it("add items to store", function () {
            expect(selectAuctionItems(getState()).length).toBe(0);
            dispatch(addItem());
            dispatch(inputChange('Something', InputKey.title));
            dispatch(addItem());
            dispatch(inputChange('Something Else', InputKey.title));
            expect(selectAuctionItems(getState()).length).toBe(2);
            expect(selectAuctionItems(getState())[0].id).toBe(0);
            expect(selectAuctionItems(getState())[1].id).toBe(1);
            expect(selectFocusedIndex(getState())).toBe(1);
        });

        it('add item no-op if current item has no title', function () {
            dispatch(addItem());
            expect(selectAuctionItems(getState()).length).toBe(1);
            dispatch(addItem());
            expect(selectAuctionItems(getState()).length).toBe(1);
        });

        it('add item selects item without title if one exists', function () {
            dispatch(addItem());
            dispatch(inputChange('Something', InputKey.title));
            dispatch(addItem());
            expect(selectAuctionItems(getState()).length).toBe(2);
            dispatch(itemFocus(0));
            expect(selectFocusedIndex(getState())).toBe(0);
            dispatch(addItem());
            expect(selectAuctionItems(getState()).length).toBe(2);
            expect(selectFocusedIndex(getState())).toBe(1);
        });

        it('can add after deleting', function () {
            dispatch(addItem());
            dispatch(inputChange('Something', InputKey.title));
            dispatch(addItem());
            dispatch(inputChange('Something Else', InputKey.title));
            expect(selectAuctionItems(getState()).length).toBe(2);
            dispatch(deleteItemSuccess(0));
            expect(selectAuctionItems(getState()).length).toBe(1);
            dispatch(addItem());
            expect(selectAuctionItems(getState()).length).toBe(2);
            expect(selectAuctionItems(getState())[1].id).toBe(2);
        });

        it('deleteItem removes item from store', function () {
            dispatch(addItem());
            dispatch(inputChange('Something', InputKey.title));
            dispatch(addItem());
            dispatch(inputChange('Something Else', InputKey.title));
            expect(selectAuctionItems(getState()).length).toBe(2);
            dispatch(deleteItemSuccess(0));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectAuctionItems(getState()).find(item => item.id === 1)).toBeTruthy();
            expect(selectAuctionItems(getState()).find(item => item.id === 0)).toBeUndefined();
        });

        it('deleting last item replaces item with blank item', function () {
            dispatch(addItem());
            dispatch(inputChange('Something', InputKey.title));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectAuctionItems(getState())[0].id).toBe(0);
            expect(selectAuctionItems(getState())[0].title).toBe('Something');
            dispatch(deleteItemSuccess(0));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectAuctionItems(getState())[0].title).toBe('');
        });

        // it('save requires title', function () {
        //     dispatch(addItem());
        //     dispatch()
        // });

        // it('save is disabled if no changes', function () {
            
        // });

        // it('focus on another item warns if not saved', function () {
        //     dispatch(addItem());
        //     dispatch(inputChange('Something', InputKey.title));
        //     dispatch(addItem());
        // });

        it('select item', function () {
            dispatch(addItem());
            dispatch(inputChange('Something', InputKey.title));
            dispatch(addItem());
            dispatch(inputChange('Something Else', InputKey.title));
            dispatch(addItem());
            dispatch(inputChange('A Third Something', InputKey.title));
            expect(selectFocusedIndex(getState())).toBe(2);
            dispatch(itemFocus(0));
            expect(selectFocusedIndex(getState())).toBe(0);
        });

        it('input change', function () {
            const bids = [{name: 'min', value: 0}];
            dispatch(addItem());
            dispatch(itemFocus(0));
            const [firstItem] = selectAuctionItems(getState());
            expect(firstItem.title).toBe('');
            expect(firstItem.description).toBe('');
            expect(firstItem.bids).toEqual(bids);
            dispatch(inputChange('Blah', InputKey.title));
            const [firstItemTitleChange] = selectAuctionItems(getState());
            expect(firstItemTitleChange.title).toBe('Blah');
            expect(firstItemTitleChange.description).toBe('');
            expect(firstItemTitleChange.bids).toEqual(bids);
            dispatch(inputChange('Blah blah', InputKey.description));
            const [firstItemDescChange] = selectAuctionItems(getState());
            expect(firstItemDescChange.title).toBe('Blah');
            expect(firstItemDescChange.description).toBe('Blah blah');
            expect(firstItemDescChange.bids).toEqual(bids);
            dispatch(inputChange('42', InputKey.minBid));
            const [firstItemMinBidChange] = selectAuctionItems(getState());
            expect(firstItemMinBidChange.title).toBe('Blah');
            expect(firstItemMinBidChange.description).toBe('Blah blah');
            expect(firstItemMinBidChange.bids).toEqual([{name: 'min', value: 42}]);
        });

        it('submit updates store', function () {
            const fakeItem = {
                id: 0,
                title: 'Blah',
                viewDetails: false,
                description: 'Hello',
                bids: [{name: 'Me', value: 5 }]
            };
            dispatch(addItem());
            expect(selectFirstItem(getState())).toEqual(newItem);
            dispatch(submitChangeSuccess(fakeItem));
            expect(selectFirstItem(getState())).toEqual(fakeItem);
        });
    });

    describe('User', function () {

        it('load auction data', function () {
            const rawAuctionItems = [{
                id: 45,
                title: 'Boo',
                viewDetails: true,
                description: 'Hello',
                bids: [{name: 'Me', value: 75}]
            }];
            dispatch(fetchAuctionSuccess({ rawAuctionItems }));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectAuctionItems(getState())).toMatchSnapshot();
            const newItemInFetch = [{
                id: 45,
                title: 'Boo',
                viewDetails: true,
                description: 'Hello',
                bids: [{name: 'Me', value: 75}]
            }, {
                id: 50,
                title: 'Bee',
                viewDetails: false,
                description: 'Hi again',
                bids: [{name: 'You', value: 75}]
            }];
            dispatch(fetchAuctionSuccess({ rawAuctionItems: newItemInFetch }));
            expect(selectAuctionItems(getState()).length).toBe(2);
            expect(selectAuctionItems(getState())).toMatchSnapshot();
        });

        it('load auction data with no items', function () {
            dispatch(fetchAuctionSuccess({ rawAuctionItems: [] }));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectAuctionItems(getState())).toEqual([newItem]);
        });

        it('load auction data with new item', function () {
            dispatch(fetchAuctionSuccess({ rawAuctionItems: [] }));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectAuctionItems(getState())).toEqual([newItem]);
        });

        it('error getting auction data', function () {
            dispatch(fetchAuctionError(new Error('Boo!')));
            expect(selectIsLoaded(getState())).toBe(true);
            expect(selectError(getState()).message).toBe('Boo!');
        });

        it('show/hide details', function () {
            dispatch(addItem());
            dispatch(inputChange('Something', InputKey.title));
            dispatch(addItem());
            dispatch(inputChange('Something Else', InputKey.title));
            dispatch(addItem());
            dispatch(inputChange('A Third Something', InputKey.title));
            expect(selectAuctionItems(getState()).some(item => item.viewDetails)).toBe(false);
            dispatch(toggleDescription(0));
            dispatch(toggleDescription(2));
            expect(selectItem(getState(), 0).viewDetails).toBe(true);
            expect(selectItem(getState(), 1).viewDetails).toBe(false);
            expect(selectItem(getState(), 2).viewDetails).toBe(true);

            dispatch(deleteItemSuccess(1));
            dispatch(toggleDescription(2));
            expect(selectAuctionItems(getState()).length).toBe(2);
            expect(selectItem(getState(), 0).viewDetails).toBe(true);
            expect(selectItem(getState(), 2).viewDetails).toBe(false);
        });

        it('toggle does nothing if item not in store', function () {
            expect(selectAuctionItems(getState()).length).toBe(0);
            dispatch(toggleDescription(0));
            expect(getState()).toEqual(initialState);
        });

        it('quick bid increments bid', function () {
            dispatch(addItem())
            expect(selectFirstItem(getState()).bids.length).toBe(1)
            dispatch(quickBid(TESTER_1, 0, true));
            const bids = selectFirstItem(getState()).bids;
            expect(bids.length).toBe(2);
            expect(bids[1].name).toBe(TESTER_1);
            expect(bids[1].value).toBe(bids[0].value + BID_INCREMENT);
        });

        it('quick bid calls put', function () {
            const moxios = {
                put: jest.fn().mockResolvedValue({ data: { updatedItem: {}}})
            }
            const { dispatch } = initStore({axios: moxios});
            expect(moxios.put).not.toBeCalled();
            dispatch(addItem());
            dispatch(quickBid(TESTER_1, 0));
            expect(moxios.put).toBeCalledTimes(1);
        });

        it('quick bid does nothing if item not in store', function () {
            const moxios = { put: jest.fn() };
            const { dispatch, getState } = initStore({axios: moxios});
            expect(moxios.put).not.toBeCalled();
            expect(selectAuctionItems(getState()).length).toBe(0);
            dispatch(quickBid(TESTER_1, 0));
            expect(getState()).toEqual(initialState);
            expect(moxios.put).not.toBeCalled()
        });
    });
});