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

// test.each([
//     [1, 0],
//     [[], 0],
//     [null, 0],
//     ['Joe', 0],
//     [[null], 0],
//     [undefined, 0],
//     [[{value: null, name: 'Joe'}], {value: 0, name: ''}],
//     [[{value: 0, name: 'Joe'}], {value: 0, name: ''}],
//     [[{value: 1, name: 'Joe'}], {value: 1, name: 'Joe'}],
//     [[{value: 2, name: 'Joe'}, {value: 1, name: 'Bob'}], {value: 2, name: 'Joe'}],
// ])('getMinBidValue %%', (bids, expected) => {
//     expect(utils.getMinBidValue(bids)).toEqual(expected)
// });