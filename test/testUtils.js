export const TESTER_1 = 'Tester 1';
export const TESTER_2 = 'Tester 2';

export const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const quickBid = (item, bidder, increase = 5) => {
    const maxBid = Math.max(item.bids.map(bid => bid.bid));
    return { name: bidder, bid: maxBid + increase };
}

export const pollForState = (target, state, timeout = 2000) => {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (target.state(state)) {
                clearInterval(interval);
                resolve();
            } else if (Date.now() - start > timeout) {
                clearInterval(interval);
                reject('Timed out!');
            }
        }, 10);
    });
};

export const wait = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};