import { BID_INCREMENT } from "../src/reducers";

export const TESTER_1 = 'TESTER 1';
export const TESTER_2 = 'TESTER 2';

export const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const quickBid = (item, bidder) => {
    const maxBid = Math.max(item.bids.map(bid => bid.value));
    return { name: bidder, value: maxBid + BID_INCREMENT };
}

export const wait = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

export const fakeItems = [{
    id: 0,
    title: 'Donovan\'s Greatest Hits',
    description: 'Includes Barabbajaggle of course',
    bids: [{value: 30000, name: 'min'}],
},{
    id: 2,
    title: 'A Very Donovan Christmas',
    description: 'And a Happy New Year',
    bids: [{value: 40000, name: 'min'}]
}];
