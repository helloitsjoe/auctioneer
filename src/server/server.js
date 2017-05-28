const express = import * from 'express';
const app = express();

const DataModel = import * from '../DataModel';

export default class Server {
    // let data = import * from '../data';

    constructor() {
        // this.data = import * from '../data';
        this.data = new DataModel();
    }

    // Listen for request to '/', send json data back
    app.on('/', () => {
        let refresh = setInterval(() => {
            clearInterval(refresh);
            return this.data.getData();
        }, 3000);
    });

    app.on('GET', (req, res) => {
        if (req is valid) {
            res = this.data.getData();
        } else {
            res = 'Invalid request';
        }
    });

    // On data change, push changes to all observers
    app.on('POST', (req, res) => {
        if (req is valid) {
            // will req include all 3 params?
            this.data.addBid(req);
            // How to push to all observers?
            res = this.data.getData();
        } else {
            res = 'Invalid request';
        }
    });
}

// and/or listen for request to '/userID', send user_bids data back
