import { initStore } from "../src/store";
import { addItem, itemFocus, deleteItemSuccess, inputChange } from "../src/actions/adminActions";
import { toggleDescription,
    quickBid,
    setAuctionError,
    setAuctionData } from "../src/actions/auctionItemActions";
import { TESTER_1 } from "./testUtils";
import { BID_INCREMENT,
    selectAuctionItems,
    selectSelectedIndex,
    selectIsLoaded,
    selectError,
    selectItem } from "../src/reducers";
import { InputKey } from "../src/admin/ItemEditor";

describe("redux duck tests", () => {

    const moxios = {
        put: jest.fn()
    }

    const initialState = {
        auctionItems: [],
        error: null,
        isLoaded: false,
        selectedIndex: 0,
        userTotal: 0
    }

    let getState;
    let dispatch;

    beforeEach(() => {
        const store = initStore({axios: moxios});
        getState = store.getState;
        dispatch = store.dispatch;
    });

    it("initial state", function () {
        expect(getState()).toEqual(initialState);
    });

    describe('Admin', function () {

        it("add item to store", function () {
            expect(selectAuctionItems(getState()).length).toBe(0);
            dispatch(addItem());
            dispatch(addItem());
            expect(selectAuctionItems(getState()).length).toBe(2);
            expect(selectAuctionItems(getState())[0].id).toBe(0);
            expect(selectAuctionItems(getState())[1].id).toBe(1);
            expect(selectSelectedIndex(getState())).toBe(1);
        });

        it('can add after deleting', function () {
            dispatch(addItem());
            dispatch(addItem());
            expect(selectAuctionItems(getState()).length).toBe(2);
            dispatch(deleteItemSuccess(0));
            expect(selectAuctionItems(getState()).length).toBe(1);
            dispatch(addItem());
            expect(selectAuctionItems(getState()).length).toBe(2);
            expect(selectAuctionItems(getState())[1].id).toBe(2);
        });

        it.skip('add item no-op if selected has no title/description', function () {
            dispatch(addItem());
            expect(selectAuctionItems(getState()).length).toBe(1);
            dispatch(addItem());
            expect(selectAuctionItems(getState()).length).toBe(1);
        });

        it('deleteItem removes item from store', function () {
            dispatch(addItem());
            dispatch(addItem());
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

        it('save requires title and description', function () {});

        it('select item', function () {
            dispatch(addItem());
            dispatch(addItem());
            dispatch(addItem());
            expect(selectSelectedIndex(getState())).toBe(2);
            dispatch(itemFocus(0));
            expect(selectSelectedIndex(getState())).toBe(0);
        });
    });

    describe('User', function () {

        it('load auction data', function () {
            const fakeAuctionItem = {
                id: 45,
                title: 'Boo',
                viewDetails: false,
                description: 'Hello',
                bids: [{name: 'Me', value: 75}]
            };
            dispatch(setAuctionData([fakeAuctionItem]));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectAuctionItems(getState())[0]).toEqual(fakeAuctionItem);
        });

        it('error getting auction data', function () {
            dispatch(setAuctionError(new Error('Boo!')));
            expect(selectIsLoaded(getState())).toBe(true);
            expect(selectError(getState()).message).toBe('Boo!');
        });

        it('show/hide details', function () {
            dispatch(addItem());
            dispatch(addItem());
            dispatch(addItem());
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

        it('quick bid increments bid', function () {
            dispatch(addItem())
            expect(selectAuctionItems(getState())[0].bids.length).toBe(1)
            dispatch(quickBid(TESTER_1, 0));
            const bids = selectAuctionItems(getState())[0].bids;
            expect(bids.length).toBe(2);
            expect(bids[1].name).toBe(TESTER_1);
            expect(bids[1].value).toBe(bids[0].value + BID_INCREMENT);
            expect(moxios.put).toHaveBeenCalled();
        });

        it('input change', function () {
            dispatch(addItem());
            const [firstItem] = selectAuctionItems(getState());
            expect(firstItem.title).toBe('');
            expect(firstItem.description).toBe('');
            expect(firstItem.bids).toEqual([{name: 'min', value: 0}]);
            dispatch(inputChange('Blah', InputKey.title));
            const [firstItemTitleChange] = selectAuctionItems(getState());
            expect(firstItemTitleChange.title).toBe('Blah');
            expect(firstItemTitleChange.description).toBe('');
            expect(firstItemTitleChange.bids).toEqual([{name: 'min', value: 0}]);
            dispatch(inputChange('Blah blah', InputKey.description));
            const [firstItemDescChange] = selectAuctionItems(getState());
            expect(firstItemDescChange.title).toBe('Blah');
            expect(firstItemDescChange.description).toBe('Blah blah');
            expect(firstItemDescChange.bids).toEqual([{name: 'min', value: 0}]);
            dispatch(inputChange('42', InputKey.minBid));
            const [firstItemMinBidChange] = selectAuctionItems(getState());
            expect(firstItemMinBidChange.title).toBe('Blah');
            expect(firstItemMinBidChange.description).toBe('Blah blah');
            expect(firstItemMinBidChange.bids).toEqual([{name: 'min', value: 42}]);
        });
    });
});