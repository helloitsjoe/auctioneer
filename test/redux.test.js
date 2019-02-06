import { initStore } from '../src/store';
import {
    submitChange,
    deleteRequest,
    deleteItemSuccess,
    submitChangeSuccess,
} from '../src/actions/adminActions';
import {
    toggleDescription,
    quickBid,
    fetchAuctionError,
    fetchAuctionSuccess,
} from '../src/actions/auctionItemActions';
import { TESTER_1, fakeItems, wait } from './testUtils';
import {
    BID_INCREMENT,
    selectItem,
    selectError,
    selectIsLoaded,
    selectFirstItem,
    selectAuctionItems,
} from '../src/reducers';
import { createNewAuctionItem } from '../src/utils';

describe('redux duck tests', () => {
    const initialState = {
        error: null,
        userTotal: 0,
        isLoaded: false,
        auctionItems: [],
    };

    const newItem = {
        id: 0,
        title: '',
        description: '',
        viewDetails: false,
        bids: [{ name: 'min', value: 0 }],
    };

    let getState;
    let dispatch;
    let store;

    beforeEach(() => {
        store = initStore({});
        getState = store.getState;
        dispatch = store.dispatch;
    });

    it('initial state', function() {
        expect(getState()).toEqual(initialState);
    });

    describe('Admin', function() {
        it('deleteItem removes item from store', function() {
            dispatch(fetchAuctionSuccess({ rawAuctionItems: fakeItems }));
            expect(selectAuctionItems(getState()).length).toBe(2);
            dispatch(deleteItemSuccess(0));
            expect(selectAuctionItems(getState()).length).toBe(1);
            const items = selectAuctionItems(getState());
            expect(items.find(item => item.id === 1)).toBeTruthy();
            expect(items.find(item => item.id === 0)).toBeUndefined();
        });

        it('deleteItem error does NOT remove item', async function() {
            const mockFetchService = {
                deleteItem: jest.fn().mockRejectedValue('nope'),
            };
            store = initStore(mockFetchService);
            getState = store.getState;
            dispatch = store.dispatch;

            dispatch(fetchAuctionSuccess({ rawAuctionItems: fakeItems }));
            expect(selectAuctionItems(getState()).length).toBe(2);
            dispatch(deleteRequest(0));
            await wait(0);
            expect(selectAuctionItems(getState()).length).toBe(2);
            const items = selectAuctionItems(getState());
            expect(items.find(item => item.id === 1)).toBeTruthy();
            expect(items.find(item => item.id === 0)).toBeTruthy();
        });

        it('deleting last item replaces item with blank item', function() {
            const [fakeItem] = fakeItems;
            dispatch(fetchAuctionSuccess({ rawAuctionItems: [fakeItem] }));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectFirstItem(getState()).id).toBe(fakeItem.id);
            expect(selectFirstItem(getState()).title).toBe(fakeItem.title);
            dispatch(deleteItemSuccess(fakeItem.id));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectFirstItem(getState()).title).toBe('');
        });

        it('submit updates store', function() {
            const fakeItem = {
                id: 0,
                title: 'Blah',
                viewDetails: false,
                description: 'Hello',
                bids: [{ name: 'Me', value: 5 }],
            };
            dispatch(
                fetchAuctionSuccess({
                    rawAuctionItems: [createNewAuctionItem()],
                })
            );
            expect(selectFirstItem(getState())).toEqual(newItem);
            dispatch(submitChangeSuccess(fakeItem));
            expect(selectFirstItem(getState())).toEqual(fakeItem);
        });

        it('submit error does NOT update store', async function() {
            const mockFetchService = {
                updateItem: jest.fn().mockRejectedValue('nope'),
            };
            store = initStore(mockFetchService);
            getState = store.getState;
            dispatch = store.dispatch;
            const fakeItem = {
                id: 0,
                title: 'Blah',
                viewDetails: false,
                description: 'Hello',
                bids: [{ name: 'Me', value: 5 }],
            };
            dispatch(
                fetchAuctionSuccess({
                    rawAuctionItems: [createNewAuctionItem()],
                })
            );
            expect(selectFirstItem(getState())).toEqual(newItem);
            dispatch(submitChange(fakeItem));
            await wait(0);
            expect(selectFirstItem(getState())).toEqual(newItem);
        });
    });

    describe('User', function() {
        it('load auction data', function() {
            const rawAuctionItems = [
                {
                    id: 45,
                    title: 'Boo',
                    viewDetails: true,
                    description: 'Hello',
                    bids: [{ name: 'Me', value: 75 }],
                },
            ];
            dispatch(fetchAuctionSuccess({ rawAuctionItems }));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectAuctionItems(getState())).toMatchSnapshot();
            const newItemInFetch = [
                {
                    id: 45,
                    title: 'Boo',
                    viewDetails: true,
                    description: 'Hello',
                    bids: [{ name: 'Me', value: 75 }],
                },
                {
                    id: 50,
                    title: 'Bee',
                    viewDetails: false,
                    description: 'Hi again',
                    bids: [{ name: 'You', value: 75 }],
                },
            ];
            dispatch(fetchAuctionSuccess({ rawAuctionItems: newItemInFetch }));
            expect(selectAuctionItems(getState()).length).toBe(2);
            expect(selectAuctionItems(getState())).toMatchSnapshot();
        });

        it('load auction data with no items', function() {
            dispatch(fetchAuctionSuccess({ rawAuctionItems: [] }));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectAuctionItems(getState())).toEqual([newItem]);
        });

        it('load auction data with new item', function() {
            dispatch(fetchAuctionSuccess({ rawAuctionItems: [] }));
            expect(selectAuctionItems(getState()).length).toBe(1);
            expect(selectAuctionItems(getState())).toEqual([newItem]);
        });

        it('error getting auction data', function() {
            dispatch(fetchAuctionError(new Error('Boo!')));
            expect(selectIsLoaded(getState())).toBe(true);
            expect(selectError(getState()).message).toBe('Boo!');
        });

        it('show/hide details', function() {
            const thirdItem = {
                ...createNewAuctionItem(fakeItems),
                title: 'Third',
            };
            const fakeWithThree = [...fakeItems, thirdItem];
            dispatch(fetchAuctionSuccess({ rawAuctionItems: fakeWithThree }));
            expect(
                selectAuctionItems(getState()).some(item => item.viewDetails)
            ).toBe(false);
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

        it('toggle does nothing if item not in store', function() {
            expect(selectAuctionItems(getState()).length).toBe(0);
            dispatch(toggleDescription(0));
            expect(getState()).toEqual(initialState);
        });

        it('quick bid increments bid', function() {
            dispatch(
                fetchAuctionSuccess({
                    rawAuctionItems: [createNewAuctionItem()],
                })
            );
            expect(selectFirstItem(getState()).bids.length).toBe(1);
            dispatch(quickBid(TESTER_1, 0, true));
            const bids = selectFirstItem(getState()).bids;
            expect(bids.length).toBe(2);
            expect(bids[1].name).toBe(TESTER_1);
            expect(bids[1].value).toBe(bids[0].value + BID_INCREMENT);
        });

        it('quick bid calls updateItem', function() {
            const mockFetchService = {
                updateItem: jest
                    .fn()
                    .mockResolvedValue({ data: { updatedItem: {} } }),
            };
            const { dispatch } = initStore(mockFetchService);
            expect(mockFetchService.updateItem).not.toBeCalled();
            dispatch(
                fetchAuctionSuccess({
                    rawAuctionItems: [createNewAuctionItem()],
                })
            );
            dispatch(quickBid(TESTER_1, 0));
            expect(mockFetchService.updateItem).toBeCalledTimes(1);
        });

        it('quick bid does nothing if item not in store', function() {
            const mockFetchService = { updateItem: jest.fn() };
            const { dispatch, getState } = initStore(mockFetchService);
            expect(mockFetchService.updateItem).not.toBeCalled();
            expect(selectAuctionItems(getState()).length).toBe(0);
            dispatch(quickBid(TESTER_1, 0));
            expect(getState()).toEqual(initialState);
            expect(mockFetchService.updateItem).not.toBeCalled();
        });
    });
});
