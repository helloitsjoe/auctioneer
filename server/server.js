const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// const data = require('./data.json');
const dataPath = path.join(__dirname, './data.json');

// Listen for request to '/', send json data back
app.get('/data', function(req, res) {
    getData((data) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.send(JSON.parse(data));
    })
    // res.sendFile(path.join(__dirname, '../../index.html'));
});

// // On data change, push changes to all observers
app.post('/data', function(req, res) {
    console.log(req.body);
    fs.writeFile(dataPath, req.body, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Saved!');
            res.send(body);
        }
    });
    // How to push to all observers?
});

app.listen(3001, () => {
    console.log('Listening on port 3001');
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
