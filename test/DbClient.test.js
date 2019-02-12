const BaseDbClient = require('../server/baseDbClient');

describe('BaseDbClient', () => {
    it('all methods are abstract', () => {
        Object.entries(BaseDbClient.prototype).forEach(([key, value]) => {
            expect(value).toThrowError(`${key} must be overwritten!`);
        });
    });

    it('contains all methods', () => {
        const methods = ['getAuctionData', 'upsertAuctionItem', 'deleteItem'];
        methods.forEach(method => {
            expect(BaseDbClient.prototype[method]).not.toBeUndefined();
        });
    });
});
