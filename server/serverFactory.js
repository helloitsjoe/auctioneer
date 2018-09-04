const fs = require('fs');
const os = require('os');
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
    
    app.put('/data/:id', (req, res) => {
        const body = JSON.parse(req.body.body);
        const id = parseInt(req.params.id);
        auctionData[id] = body;
        console.log('bids:', body.bids);
        console.log(`High bid for ${body.id}: ${body.bids.slice(-1)[0].value}`);
        
        // TODO: Use WebSockets to push updates to all users
        
        res.sendStatus(200);
    });

    app.delete('/data/:id', (req, res) => {
        const incomingID = parseInt(req.params.id);
        auctionData = auctionData
            .filter(item => item.id !== incomingID)
            .map((item, i) => Object.assign({}, item, { id: i }));

        res.status(200).send(auctionData);
    });

    logIPAddress(port);
    
    try {
        const fileContents = await readFile(dataPath, 'utf-8');
        auctionData = JSON.parse(fileContents);
        // auctionData = json.map((item, i) => Object.assign({}, item, { id: i }));
        
        const server = app.listen(port, () => {
            console.log(`Listening on ${host}:${port}`);
        });

        return server;
    } catch (err) {
        console.error(err);
    }
}

function logIPAddress(port) {
    const ifaces = os.networkInterfaces();
    const ifKeys = Object.keys(ifaces);
    const ip = ifKeys.reduce((final, curr) => {
        const config = ifaces[curr].find(config => config.address.includes('192.168'));
        return config ? config.address : final;
    }, '');
    console.log(`To bid on your phone, go to ${ip}:${port}`);
}

module.exports = {
    createServer 
};