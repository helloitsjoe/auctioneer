
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

export const DATA_URL = `http://${window.location.hostname}:3001/data`;

export const randFromArr = (arr) => arr[Math.floor(Math.random() * arr.length)];