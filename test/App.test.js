import * as nock from 'nock';
import * as React from 'react';
import { mount } from 'enzyme';
import { App } from '../src/containers/App';

const auctionData = require('../server/data.json');

describe('App', function () {

    const host = 'localhost';
    const port = 3001;

    beforeEach(() => {
        nock(`http://${host}:${port}`)
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .persist()
            .get('/data')
            .reply(200, auctionData);
    });

    afterEach(() => {
        nock.cleanAll();
    })
    
    it('isLoaded = false until data returns', function () {
        const app = mount(<App />);
        expect(app.state('isLoaded')).toBe(false);
        expect(app.html()).toEqual('<div>Loading...</div>');
    });

    it('isLoaded = true after data returns', function (done) {
        const app = mount(<App />);
        const interval = setInterval(() => {
            if (app.state('isLoaded')) {
                clearInterval(interval);
                expect(app.state('auctionItems')).toEqual(auctionData);
                done();
            }
        }, 10);
    });

    it('two users get the same initial data', function (done) {
        // TODO: Figure out how to mount these in separate windows
        const app1 = mount(<App />);
        const app2 = mount(<App />);
        const interval = setInterval(() => {
            if (app1.state('isLoaded') && app2.state('isLoaded')) {
                clearInterval(interval);
                console.log('app1', app1.html())
                console.log('app2', app2.html())
                done();
            }
        }, 10);
    });
});