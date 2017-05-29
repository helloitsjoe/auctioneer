// import * as express from 'express';
const express = require('express');
const app = express();
// const data = import data from '../data';

let data = [
    {
        bids: [ { name: 'min', bid: 150 } ],
        title: 'Lowell Weekend',
        description: "Enjoy a relaxing weekend in beautiful Lowell Massachussets. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        photos: null
    },
    {
        bids: [ { name: 'min', bid: 30 } ],
        title: 'Ice Cream Tasting',
        description: "Taste some delicious ice cream! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        photos: null
    },
    {
        bids: [ { name: 'min', bid: 75 } ],
        title: 'Wrestling Lessons',
        description: "Learn how to wrestle from the semi-pros! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        photos: null
    },
    {
        bids: [ { name: 'min', bid: 40 } ],
        title: 'Game Night',
        description: "Fun and games! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        photos: null
    },
];

// const DataModel = import * from '../DataModel';

// export default class Server {
//     // let data = import * from '../data';
//
//     constructor() {
//         // this.data = import * from '../data';
//         this.data = new DataModel();
//     }

    // Listen for request to '/', send json data back
    app.get('/', (req, res) => {
        // let refresh = setInterval(() => {
        //     clearInterval(refresh);
        //     return this.data.getData();
        // }, 3000);
        res.send(data);
    });

    // app.on('GET', (req, res) => {
    //     if (req is valid) {
    //         res = this.data.getData();
    //     } else {
    //         res = 'Invalid request';
    //     }
    // });

    // On data change, push changes to all observers
    app.post('/', (req, res) => {
        // if (req is valid) {
            // will req include all 3 params?
            this.data.addBid(req);
            // How to push to all observers?
            res = this.data.getData();
        // } else {
            // res = 'Invalid request';
        // }
    });

    // listen() {
    app.listen(3000, () => {
        console.log('HI');
    })
    // }
// }

// and/or listen for request to '/userID', send user_bids data back
