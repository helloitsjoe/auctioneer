export const TESTER_1 = 'TESTER 1';
export const TESTER_2 = 'TESTER 2';

export const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const quickBid = (item, bidder, increase = 5) => {
    const maxBid = Math.max(item.bids.map(bid => bid.value));
    return { name: bidder, value: maxBid + increase };
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