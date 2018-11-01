import dispatch from "redux";
import {
    initStore
} from "../src/store";
import {
    addItem
} from "../src/actions/adminActions";
import {
    createNewAuctionItem
} from "../src/utils";
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

    it("add item", function () {
        expect(store.getState().auctionItems.length).toBe(0);
        store.dispatch(addItem());
        expect(store.getState().auctionItems.length).toBe(1);
        // TODO: Make this id unique (and settable?)
        expect(store.getState().auctionItems[0].id).toBe(0);
    });

    it('toggle item description', function () {
        store.dispatch(addItem());
        expect(store.getState().auctionItems[0].viewDetails).toBe(false);
        store.dispatch(toggleDescriptionAction(0));
        expect(store.getState().auctionItems[0].viewDetails).toBe(true);
    });
});