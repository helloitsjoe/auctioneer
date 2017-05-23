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

let bids = {
    newport_weekend: [ { null: 150 } ],
    wine_tasting: [ { null: 30 } ],
    dancing_lessons: [ { null: 75 } ],
    game_night: [ { null: 40 } ],
}
