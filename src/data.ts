// Initial setup:
//     Collection of items up for bid, each with an array of bids, initialized with minimum bid
//     How to connect names with bids? Add { name: bid } to array? Or [ name, bid ]?
//
//     Something like:
//         let bids = {
//             newport_weekend: [ { null: 150 } ],
//             wine_tasting: [ { null: 30 } ],
//         }
//
//     bids.newport_weekend.push({ 'user_01': 155 });

let data:any = [
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

export default data;
