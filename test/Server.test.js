const axios = require('axios');
const expect = require('chai').expect;
const { createServer } = require('../server/serverFactory');

describe('Server', function () {
    
    let server;
    const host = 'localhost';
    const port = 1234;
    const url = `http://${host}:${port}`;

    before(async () => {
        server = await createServer(host, port);
    });

    after((done) => {
        server.close(done);
    });

    it('gets /', async function () {
        const res = await axios.get(url);
        expect(res.data).to.include('<!DOCTYPE html>');
    });

    it('gets /data', async function () {
        const res = await axios.get(url + '/data');
        expect(res.data).to.be.ok;
    });

    it('bids initialize with min bidder', async function () {
        const res = await axios.get(url + '/data');
        res.data.forEach(auctionItem => {
            expect(auctionItem.bids.length).to.equal(1);
            expect(auctionItem.bids[0].name).to.equal('min');
        })
    });

    it('auction item ids match index', async function () {
        const res = await axios.get(url + '/data');
        res.data.forEach((auctionItem, i) => {
            expect(auctionItem.id).to.equal(i);
        });
    });
});