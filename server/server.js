const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

const dataPath = path.join(__dirname, './data.json');
let auctionData = null;

app.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/data', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send(auctionData);
});

app.put('/data', (req, res) => {
    let body = JSON.parse(req.body.body);
    let id = body.id;
    console.log(body.bids);
    const auctionItem = auctionData[id];
    auctionItem.bids = body.bids;
    console.log(`High bid for ${auctionItem.id}: ${auctionItem.bids[auctionItem.bids.length - 1].bid}`);

    // TODO: Use WebSockets to push updates to all users

    res.sendStatus(200);
});

fs.readFile(dataPath, (err,  data) => {
        if (err) {
            console.error(err);
        done(err);
        } else {
        // Only keep data in memory for now
        // TODO: Set up a database to persist changes
        auctionData = JSON.parse(data);
        app.listen(3001, () => {
            console.log('Listening on port 3001');
        });
        }
    });
