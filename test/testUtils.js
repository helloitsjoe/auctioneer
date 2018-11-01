export const TESTER_1 = 'TESTER 1';
export const TESTER_2 = 'TESTER 2';

export const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const quickBid = (item, bidder, increase) => {
    const maxBid = Math.max(item.bids.map(bid => bid.value));
    return { name: bidder, value: maxBid + increase };
}

export const wait = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};