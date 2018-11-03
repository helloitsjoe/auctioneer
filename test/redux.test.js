import {
    initStore
} from "../src/store";
import {
    addItem,
    deleteItemSuccess,
    inputChange,
    selectItem
} from "../src/actions/adminActions";
import {
    toggleDescriptionAction, quickBidAction, setAuctionError, setAuctionData
} from "../src/actions/auctionItemActions";
import { TESTER_1 } from "./testUtils";
import { BID_INCREMENT } from "../src/reducers";
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

    let store;

    beforeEach(() => {
        store = initStore({axios: moxios});
    });

    it("initial state", function () {
        expect(store.getState()).toEqual(initialState);
    });

    describe('Admin', function () {

        it("add item to store", function () {
            expect(store.getState().auctionItems.length).toBe(0);
            store.dispatch(addItem());
            store.dispatch(addItem());
            expect(store.getState().auctionItems.length).toBe(2);
            expect(store.getState().auctionItems[0].id).toBe(0);
            expect(store.getState().auctionItems[1].id).toBe(1);
            expect(store.getState().selectedIndex).toBe(1);
        });

        it('can add after deleting', function () {
            store.dispatch(addItem());
            store.dispatch(addItem());
            expect(store.getState().auctionItems.length).toBe(2);
            store.dispatch(deleteItemSuccess(0));
            expect(store.getState().auctionItems.length).toBe(1);
            store.dispatch(addItem());
            expect(store.getState().auctionItems.length).toBe(2);
            expect(store.getState().auctionItems[1].id).toBe(2);
        });

        it.skip('add item no-op if selected has no title/description', function () {
            store.dispatch(addItem());
            expect(store.getState().auctionItems.length).toBe(1);
            store.dispatch(addItem());
            expect(store.getState().auctionItems.length).toBe(1);
        });

        it('deleteItem removes item from store', function () {
            store.dispatch(addItem());
            store.dispatch(addItem());
            expect(store.getState().auctionItems.length).toBe(2);
            store.dispatch(deleteItemSuccess(0));
            expect(store.getState().auctionItems.length).toBe(1);
            expect(store.getState().auctionItems.find(item => item.id === 1)).toBeTruthy();
            expect(store.getState().auctionItems.find(item => item.id === 0)).toBeUndefined();
        });

        it('deleting last item replaces item with blank item', function () {
            store.dispatch(addItem());
            store.dispatch(inputChange('Something', InputKey.title));
            expect(store.getState().auctionItems.length).toBe(1);
            expect(store.getState().auctionItems[0].id).toBe(0);
            expect(store.getState().auctionItems[0].title).toBe('Something');
            store.dispatch(deleteItemSuccess(0));
            expect(store.getState().auctionItems.length).toBe(1);
            expect(store.getState().auctionItems[0].title).toBe('');
        });

        it('save requires title and description', function () {});

        it('select item', function () {
            store.dispatch(addItem());
            store.dispatch(addItem());
            store.dispatch(addItem());
            expect(store.getState().selectedIndex).toBe(2);
            store.dispatch(selectItem(0));
            expect(store.getState().selectedIndex).toBe(0);
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
            store.dispatch(setAuctionData([fakeAuctionItem]));
            expect(store.getState().auctionItems.length).toBe(1);
            expect(store.getState().auctionItems[0]).toEqual(fakeAuctionItem);
        });

        it('error getting auction data', function () {
            store.dispatch(setAuctionError(new Error('Boo!')));
            expect(store.getState().isLoaded).toBe(true);
            expect(store.getState().error.message).toBe('Boo!');
        });

        it('show/hide details', function () {
            store.dispatch(addItem());
            store.dispatch(addItem());
            store.dispatch(addItem());
            expect(store.getState().auctionItems.some(item => item.viewDetails)).toBe(false);
            store.dispatch(toggleDescriptionAction(0));
            store.dispatch(toggleDescriptionAction(2));
            expect(store.getState().auctionItems.find(it => it.id === 0).viewDetails).toBe(true);
            expect(store.getState().auctionItems.find(it => it.id === 2).viewDetails).toBe(true);

            store.dispatch(deleteItemSuccess(1));
            store.dispatch(toggleDescriptionAction(2));
            expect(store.getState().auctionItems.length).toBe(2);
            expect(store.getState().auctionItems.find(it => it.id === 0).viewDetails).toBe(true);
            expect(store.getState().auctionItems.find(it => it.id === 2).viewDetails).toBe(false);
        });

        it('quick bid increments bid', function () {
            store.dispatch(addItem())
            expect(store.getState().auctionItems[0].bids.length).toBe(1)
            store.dispatch(quickBidAction(TESTER_1, 0));
            const bids = store.getState().auctionItems[0].bids;
            expect(bids.length).toBe(2);
            expect(bids[1].name).toBe(TESTER_1);
            expect(bids[1].value).toBe(bids[0].value + BID_INCREMENT);
            expect(moxios.put).toHaveBeenCalled();
        });

        it('input change', function () {
            store.dispatch(addItem());
            expect(store.getState().auctionItems[0].title).toBe('');
            expect(store.getState().auctionItems[0].description).toBe('');
            expect(store.getState().auctionItems[0].bids).toEqual([{name: 'min', value: 0}]);
            store.dispatch(inputChange('Blah', InputKey.title));
            expect(store.getState().auctionItems[0].title).toBe('Blah');
            expect(store.getState().auctionItems[0].description).toBe('');
            expect(store.getState().auctionItems[0].bids).toEqual([{name: 'min', value: 0}]);
            store.dispatch(inputChange('Blah blah', InputKey.description));
            expect(store.getState().auctionItems[0].title).toBe('Blah');
            expect(store.getState().auctionItems[0].description).toBe('Blah blah');
            expect(store.getState().auctionItems[0].bids).toEqual([{name: 'min', value: 0}]);
            store.dispatch(inputChange('42', InputKey.minBid));
            expect(store.getState().auctionItems[0].title).toBe('Blah');
            expect(store.getState().auctionItems[0].description).toBe('Blah blah');
            expect(store.getState().auctionItems[0].bids).toEqual([{name: 'min', value: 42}]);
        });
    });
});