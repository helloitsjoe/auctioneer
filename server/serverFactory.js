const fs = require('fs');
const path = require('path');
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const readFile = util.promisify(fs.readFile);
const app = express();

const createServer = async (host, port) => {

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
    
    return readFile(dataPath).then(fileData => {
        const json = JSON.parse(fileData);
        auctionData = json.map((item, i) => Object.assign({}, item, { id: i }));
    
        return app.listen(port, () => {
            console.log(`Listening on ${host}:${port}`);
        });
    }).catch(err => {
        console.error(err);
    });
}

module.exports = {
    createServer 
};