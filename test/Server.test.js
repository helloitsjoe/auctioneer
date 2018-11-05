import * as path from 'path';
import axios from 'axios';
import { putRequest, deleteRequest } from '../src/actions/adminActions';
import { initStore } from '../src/store';
import { createServer } from '../server/serverFactory';
import { fetchAuctionData } from '../src/actions/auctionItemActions';

// This nonsense is required to get around jest CORS issue with localhost
const lib = path.join(path.dirname(require.resolve('axios')),'lib/adapters/http');
const adapter = require(lib);

describe('Server', function () {
    
    let server;
    let dispatch;
    const host = 'localhost';
    const port = 1234;
    const url = `http://${host}:${port}`;
    const dataURL = `${url}/data`;

    beforeAll(async () => {
        const store = initStore({ axios });
        dispatch = store.dispatch;

        server = await createServer(host, port);
    });

    afterEach(async () => {
        // Restore original data on server
        await axios.post(dataURL, {}, { adapter });
    });

    afterAll((done) => {
        server.close(done);
    });

    it.each([
        ['/'],
        ['/foo']
    ])('GET index.html for endpoint %s', async function (endpoint) {
        const res = await axios.get(url + endpoint, { adapter });
        expect(res.data).toMatch(/<!DOCTYPE html>/);
    });

    it('GET auction data at /data', async function () {
        const res = await axios.get(dataURL, { adapter });
        expect(res.data).toBeTruthy();
    });

    it('PUT data at /data/:id', async function () {
        const getResBefore = await axios.get(dataURL, { adapter });
        const badPutRes = await axios.put(
            url + '/data/0',
            { body: JSON.stringify({foo: 1}) },
            { adapter }).catch(err => err.response);
        expect(badPutRes.status).toBe(400);

        const [origItem] = getResBefore.data;

        const updatedItem = { ...origItem, title: 'Banana' };
        await axios.put(url + '/data/0', { body: JSON.stringify(updatedItem) }, { adapter });
        const getResAfter = await axios.get(dataURL, { adapter });
        expect(getResAfter.data[0]).toEqual(updatedItem);

        const newItem = { ...origItem, id: 5000 };
        await axios.put(url + '/data/5000', { body: JSON.stringify(newItem) }, { adapter });
        const getResAdded = await axios.get(dataURL, { adapter });
        expect(getResAdded.data.slice(-1)[0]).toEqual(newItem);
    });

    it('DELETE data at /data/:id', async function () {
        const getResBefore = await axios.get(dataURL, { adapter });

        const deleteRes = await axios.delete(`${dataURL}/0`, { adapter });
        expect(deleteRes.data).toEqual({deletedItemID: 0});

        const getResAfter = await axios.get(dataURL, { adapter });
        expect(getResAfter.data).toEqual(getResBefore.data.slice(1));
    });

    it('POST restores original', async function () {
        const getResBefore = await axios.get(dataURL, { adapter });

        const deleteRes = await axios.delete(`${dataURL}/0`, { adapter });
        expect(deleteRes.data).toEqual({deletedItemID: 0});

        const getResAfter = await axios.get(dataURL, { adapter });
        expect(getResAfter.data).not.toEqual(getResBefore.data);

        await axios.post(dataURL, {}, { adapter });

        const getResRestored = await axios.get(dataURL, { adapter });
        expect(getResRestored.data).toEqual(getResBefore.data);
    });

    it('bids initialize with min bidder', async function () {
        const res = await axios.get(dataURL, { adapter });
        res.data.forEach(auctionItem => {
            expect(auctionItem.bids.length).toEqual(1);
            expect(auctionItem.bids[0].name).toEqual('min');
        })
    });

    it('auction item ids match index', async function () {
        const res = await axios.get(dataURL, { adapter });
        res.data.forEach((auctionItem, i) => {
            expect(auctionItem.id).toEqual(i);
        });
    });

    describe('integration', function () {
        
        it('fetch auctionData', async function () {
            const auctionData = await axios.get(dataURL, { adapter });

            const fetchResponse = await dispatch(fetchAuctionData('Joe', dataURL, adapter));
            expect(fetchResponse.data).toEqual(auctionData.data);
        });
    
        it('putRequest', async function () {
            const fakeItem = {
                id: 123,
                title: 'Blah',
                description: 'Babababa',
                bids: [{name: 'me', value: 1}],
            };
            const putResponse = await dispatch(putRequest(fakeItem, dataURL, adapter));
            expect(putResponse.data).toEqual(fakeItem);
        });
    
        it('deleteRequest', async function () {
            const deleteResponse = await dispatch(deleteRequest(1, dataURL, adapter));
            expect(deleteResponse.data).toEqual({ deletedItemID: 1 });
        });
    });
});