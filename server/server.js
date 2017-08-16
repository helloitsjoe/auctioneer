const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const router = express.Router();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));
// app.use(router);

const dataPath = path.join(__dirname, './data.json');
let auctionData = null;

// Read file once, keep in memory
fs.readFile(dataPath, (err,  data) => {
    if (err) {
        console.error(err);
        done(err);
    } else {
        auctionData = JSON.parse(data);
        app.listen(3001, () => {
            console.log('Listening on port 3001');
        });
    }
});

// Listen for get request to '/', send main page back
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Listen for get request to '/data', send json data back
app.get('/data', (req, res) => {
    // res.set('Access-Control-Allow-Origin', '*');
    res.send(auctionData);
});

// On data post, push changes to all observers
app.put('/data', (req, res) => {
    let body = req.body;
    let id = body.id;
    console.log(body.bids);
    auctionData[id].bids = body.bids;
    console.log(`High bid for ${auctionData[id].id}: ${auctionData[id].bids[auctionData[id].bids.length - 1].bid}`);
    // TODO: Create new file after each post, so there's a history?
    fs.writeFile(dataPath, JSON.stringify(auctionData), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Saved!');
        }
    });
    // res.set('Access-Control-Allow-Origin', '*');
    res.sendStatus(200);
});

// On post to specific endpoint, send data for that endpoint
app.post('/data/:0', (req, res) => {
    console.log(req.body.params.id);
});

// and/or listen for request to '/userID', send user_bids data back
