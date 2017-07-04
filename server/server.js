const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const router = express.Router();

app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, '../')));
// app.use(router);

const dataPath = path.join(__dirname, './data.json');
let auctionData = null;

// Read file once, keep in memory
getData((data) => {
    auctionData = data;
    app.listen(3001, () => {
        console.log('Listening on port 3001');
    });
});

// Listen for get request to '/', send main page back
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Listen for get request to '/data', send json data back
app.get('/data', function(req, res) {
    // res.set('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(auctionData));
});

// On data post, push changes to all observers
// How to only update one particular item's data instead of the whole json obj?
app.post('/data', function(req, res){
    console.log(req.body);
    auctionData = req.body;
    // Write to file after each post?
    fs.writeFile(dataPath, req.body, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Saved!');
            // res.set('Access-Control-Allow-Origin', '*');
            res.sendStatus(200);
        }
    });
});

// On post to specific endpoint, send data for that endpoint
app.post('/data/:0', (req, res) => {
    console.log(req.body.params.id);
});


function getData(done) {
    fs.readFile(dataPath, (err, data) => {
        if (err) {
            console.error(err);
            done(err);
        } else {
            console.log(data);
            done(data);
        }
    });
}

// and/or listen for request to '/userID', send user_bids data back
