const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

const dataPath = path.join(__dirname, './data.json');
let auctionData = null;

app.get('/data', (req, res) => {
    res.send(auctionData);
});

// Route all GET requests other than /data to index
// to handle 'cannot get /users' error
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.put('/data', (req, res) => {
    let body = JSON.parse(req.body.body);
    let id = body.id;
    const auctionItem = auctionData[id];
    auctionItem.bids = body.bids;
    console.log('bids:', auctionItem.bids);
    console.log(`High bid for ${auctionItem.id}: ${auctionItem.bids.slice(-1)[0].bid}`);
    
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
        const json = JSON.parse(data);
        auctionData = json.map((item, i) => Object.assign({}, item, { id: i }));
        app.listen(3001, () => {
            console.log('Listening on port 3001');
        });
    }
});
