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

    const dataPath = path.join(__dirname, 'data.json');
    let auctionData = null;

    app.get('/data', (req, res) => {
        res.send(auctionData);
    });

    // Route all GET requests other than /data to index
    // to handle 'cannot get /users' error
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'));
    });

    // Currently only for unit tests to restore original auctionData
    app.post('/data', async (req, res) => {
        try {
            if (req.body.testError) {
                throw new Error('test!');
            }
            const fileContents = await readFile(dataPath, 'utf-8');
            auctionData = JSON.parse(fileContents);
            res.status(200).send(auctionData);
        } catch (err) {
            res.status(500).send({ error: 'Error reading data.json' });
        }
    });

    app.put('/data/:id', (req, res) => {
        const body = req.body.body;
        const id = Number(req.params.id);

        try {
            if (body.id == null) {
                throw new Error('ID is required');
            }
            if (!auctionData.find(item => item.id === id)) {
                auctionData.push(body);
            } else {
                auctionData = auctionData.map(
                    item => (item.id === id ? body : item)
                );
            }
            // console.log('bids:', body.bids);
            // console.log(`High bid for ${body.id}: ${body.bids.slice(-1)[0].value}`);
            const updatedItem = auctionData.find(item => item.id === id);
            res.status(200).send(updatedItem);
        } catch (err) {
            // console.error(err);
            res.status(400).send(err);
        }
    });

    app.delete('/data/:id', (req, res) => {
        const incomingID = Number(req.params.id);
        if (isNaN(incomingID)) {
            return res.status(400).send('ID is NaN');
        }
        auctionData = auctionData.filter(({ id }) => id !== incomingID);

        res.status(200).send({ deletedItemID: incomingID });
    });

    logIPAddress(port);

    try {
        const fileContents = await readFile(dataPath, 'utf-8');
        auctionData = JSON.parse(fileContents);

        const server = app.listen(port, () => {
            console.log(`Listening on http://${host}:${port}`);
        });

        return server;
    } catch (err) {
        console.error(err);
    }
};

function logIPAddress(port) {
    const ifaces = os.networkInterfaces();
    const ifKeys = Object.keys(ifaces);
    const ip = ifKeys.reduce((final, curr) => {
        const config = ifaces[curr].find(config =>
            config.address.includes('192.168')
        );
        return config ? config.address : final;
    }, '');
    console.log(`To bid on your phone, go to http://${ip}:${port}`);
}

module.exports = {
    createServer,
};
