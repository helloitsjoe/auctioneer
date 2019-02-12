const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const BaseDbClient = require('./baseDbClient');

const DATA_PATH = path.join(__dirname, 'data.json');

let auctionDataCache = null;

class LocalDbClient extends BaseDbClient {
    async getAuctionData() {
        if (auctionDataCache) {
            return auctionDataCache;
        }
        const fileContents = await readFile(DATA_PATH, 'utf-8');
        auctionDataCache = JSON.parse(fileContents);
        return auctionDataCache;
    }

    async upsertAuctionItem(body) {
        if (body.id == null) {
            throw new Error('ID is required');
        }
        if (!auctionDataCache) {
            auctionDataCache = await this.getAuctionData();
        }
        // TODO: Make auctionDataCache a Set?
        if (!auctionDataCache.find(item => item.id === body.id)) {
            auctionDataCache.push(body);
        } else {
            auctionDataCache = auctionDataCache.map(
                item => (item.id === body.id ? body : item)
            );
        }
    }

    async deleteItem(incomingID) {
        if (!auctionDataCache) {
            auctionDataCache = await this.getAuctionData();
        }
        auctionDataCache = auctionDataCache.filter(
            ({ id }) => id !== incomingID
        );
    }

    clearCache() {
        auctionDataCache = null;
    }
}

module.exports = LocalDbClient;
