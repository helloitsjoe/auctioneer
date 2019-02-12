const os = require('os');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const LocalDbClient = require('./localDbClient');

const createServer = async (host, port, dbClient = new LocalDbClient()) => {
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '../')));

    app.get('/data', async (req, res) => {
        const auctionData = await dbClient.getAuctionData();
        res.send(auctionData);
    });

    // Route all GET requests other than /data to index
    // to handle 'cannot get /users' error
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'));
    });

    app.put('/data/:id', async (req, res) => {
        const { body } = req.body;
        try {
            await dbClient.upsertAuctionItem(body);
            res.status(200).send(body);
        } catch (err) {
            // console.error(err);
            res.status(400).send(err);
        }
    });

    app.delete('/data/:id', async (req, res) => {
        const incomingID = Number(req.params.id);
        if (isNaN(incomingID)) {
            return res.status(400).send('ID is NaN');
        }
        await dbClient.deleteItem(incomingID);
        res.status(200).send({ deletedItemID: incomingID });
    });

    logIPAddress(port);

    try {
        await dbClient.getAuctionData();
        const server = app.listen(port, () => {
            console.log(`Listening on http://${host}:${port}`);
        });

        server.clearDbCache = dbClient.clearCache;
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
