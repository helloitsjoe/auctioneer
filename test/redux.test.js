import dispatch from "redux";
import {
    initStore
} from "../src/store";
import {
    addItem,
    deleteRequest,
    deleteItemSuccess
} from "../src/actions/adminActions";
import {
    toggleDescriptionAction
} from "../src/actions/auctionItemActions";

describe("redux duck tests", () => {

    let store;

    beforeEach(() => {
        store = initStore();
    });

    it("initial state", function () {
        const initialState = {
            auctionItems: [],
            error: null,
            isLoaded: false,
            selectedIndex: 0,
            userTotal: 0
        }
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
        });

        it('add item no-op if selected has no title/description', function () {

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

        it('deleting last item replaces item with blank item', function () {});

        it('save requires title and description', function () {});

        it('select item', function () {});
    });

    describe('User', function () {

        it('load auction data', function () {});

        it('error getting auction data', function () {});

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
            expect(store.getState().auctionItems.find(it => it.id === 0).viewDetails).toBe(true);
            expect(store.getState().auctionItems.find(it => it.id === 2).viewDetails).toBe(false);
        });

        it('quick bid increments bid', function () {});

        it('title input change', function () {});

        it('description input change', function () {});

        it('minimum bid input change', function () {});
    });
});