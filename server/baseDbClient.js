class BaseDbClient {
    // Abstract methods
    // TODO: Require these to be async?
    getAuctionData() {
        throw new Error('getAuctionData must be overwritten!');
    }
    upsertAuctionItem() {
        throw new Error('upsertAuctionItem must be overwritten!');
    }
    deleteItem() {
        throw new Error('deleteItem must be overwritten!');
    }
}

module.exports = BaseDbClient;
