const path = require('path');
const axios = require('axios');
const expect = require('chai').expect;
const { createServer } = require('../server/serverFactory');

// This nonsense is required to get around jest CORS issue with localhost
const lib = path.join(path.dirname(require.resolve('axios')),'lib/adapters/http');
const adapter = require(lib);

describe('Server', function () {
    
    let server;
    const host = 'localhost';
    const port = 1234;
    const url = `http://${host}:${port}`;

    beforeAll(async () => {
        server = await createServer(host, port);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('gets /', async function () {
        const res = await axios.get(url, { adapter });
        expect(res.data).to.include('<!DOCTYPE html>');
    });

    it('gets /data', async function () {
        const res = await axios.get(url + '/data', { adapter });
        expect(res.data).to.be.ok;
    });

    it('bids initialize with min bidder', async function () {
        const res = await axios.get(url + '/data', { adapter });
        res.data.forEach(auctionItem => {
            expect(auctionItem.bids.length).to.equal(1);
            expect(auctionItem.bids[0].name).to.equal('min');
        })
    });

    it('auction item ids match index', async function () {
        const res = await axios.get(url + '/data', { adapter });
        res.data.forEach((auctionItem, i) => {
            expect(auctionItem.id).to.equal(i);
        });
    });
});