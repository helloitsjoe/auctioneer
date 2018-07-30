const axios = require('axios');
const expect = require('chai').expect;
// TODO: use jest for testing...
const main = require('../dist/bundle');

describe('App', function () {
    
    it('test 1', function () {
        console.log('main', main);
    });
});