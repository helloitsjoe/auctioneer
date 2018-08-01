
export const DEFAULT_NAMES = [
    'Sally',
    'George',
    'Mike',
    'Buster',
    'Lucille',
    'Jefferson',
    'Lincoln',
    'Rowan',
    'Conor',
    'Snake',
    'Spike',
    'Boromir',
    'Jack',
    'Myron',
    'Shelley',
    'Olive',
    'Oliver',
    'Oscar',
    'Peter',
    'James',
    'Steve',
]

// Use window.location.hostname so mobile makes request to the correct url
export const DATA_URL = `http://${window.location.hostname}:3001/data`;

export const randFromArr = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getHighBid = (bids) => {
    return bids.reduce((high, curr) => {
        return (curr.bid > high.bid) ? curr : high;
    }, { bid: 0, name: '' });
}