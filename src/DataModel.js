const staticData = import * from './data';

export default class DataModel {
    let data = [];

    constructor() {
        // will this keep overwriting data? How many times does this class get initialized?
        this.data = staticData;
    }

    // init() {
    //     return this.data;
    // }

    getData() {
        return this.data;
    }

    addBid(itemIdx, user, amount) {
        this.data[itemIdx].bids.push({ name: user, bid: amount});
    }

    get highBid(itemIdx) {
        let tempBids = [];
        let bids = this.data[itemIdx].bids
        for (let j = 0, len = bids.length; j < len; j++) {
            tempBids.push(bids[j].bid);
        }
        return Math.max.apply(null, tempBids);
    }

    // updateUser(user) {
    //
    // }

    // updateAllUsers() {
    //
    // }
}
