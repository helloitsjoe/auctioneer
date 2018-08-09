export const TESTER_1 = 'TESTER 1';
export const TESTER_2 = 'TESTER 2';

export const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const quickBid = (item, bidder, increase = 5) => {
    const maxBid = Math.max(item.bids.map(bid => bid.value));
    return { name: bidder, value: maxBid + increase };
}

export const pollForProps = (target, propName, timeout = 2000) => {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            console.log(`testUtil isLoaded:`, target.prop('isLoaded'));
            if (!!target.prop(propName)) {
                clearInterval(interval);
                resolve();
                // console.log(`target.props():`, target.props());
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