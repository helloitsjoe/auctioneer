import * as utils from '../src/utils';

test.each([
    [1, {value: 0, name: ''}],
    [[], {value: 0, name: ''}],
    [null, {value: 0, name: ''}],
    ['Joe', {value: 0, name: ''}],
    [[null], {value: 0, name: ''}],
    [undefined, {value: 0, name: ''}],
    [[{value: null, name: 'Joe'}], {value: 0, name: ''}],
    [[{value: 0, name: 'Joe'}], {value: 0, name: ''}],
    [[{value: 1, name: 'Joe'}], {value: 1, name: 'Joe'}],
    [[{value: 2, name: 'Joe'}, {value: 1, name: 'Bob'}], {value: 2, name: 'Joe'}],
])('highBid %%', (bids, expected) => {
    expect(utils.getHighBid(bids)).toEqual(expected)
});

test.each([
    [[], 0],
    [[{value: null, name: 'Joe'}], 0],
    [[{value: 0, name: 'Joe'}], 0],
    [[{value: 1, name: 'Joe'}], 0],
    [[{value: 2, name: 'Joe'}, {value: 1, name: 'min'}], 1],
    [[{value: 1, name: 'Joe'}, {value: 2, name: 'min'}], 2],
])('getMinBidValue %%', (bids, expected) => {
    expect(utils.getMinBidValue(bids)).toEqual(expected)
});

test.each([
    [1, 0],
    [null, 0],
    ['Joe', 0],
])('getMinBidValue %% throws', (bids, expected) => {
    expect(utils.getMinBidValue).toThrow('Bids must be an array');
})