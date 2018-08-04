import { Bid } from './containers/App';

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

export const randFromArr = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getHighBid = (bids: Bid[]): Bid => {
    return bids.reduce((high, curr) => {
        return (curr.value > high.value) ? curr : high;
    }, { value: 0, name: '' });
}

export const getMinBidValue = (bids: Bid[]) => {
    const minBid = bids.find(bid => bid.name === 'min');
    return minBid ? minBid.value : 0;
}