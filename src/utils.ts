import { Bid, AuctionItem } from './reducers';

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
];

// Use window.location.hostname so mobile makes request to the correct url
export const DATA_URL = `http://${window.location.hostname}:3001/data`;

export const randFromArr = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getHighBid = (bids: Bid[]): Bid => {
  const safeBids = Array.isArray(bids) ? bids.filter(bid => !!bid) : [];
  return safeBids.reduce(
    (high, curr) => {
      return curr.value > high.value ? curr : high;
    },
    { value: 0, name: '' }
  );
};

export const getMinBidValue = (bids: Bid[]): number => {
  if (!Array.isArray(bids)) {
    throw new Error('Bids must be an array');
  }
  const minBid = bids.find(bid => bid.name === 'min');
  return minBid ? minBid.value : 0;
};

export const getUser = () => {
  return sessionStorage.getItem('userName') || '';
};

export const getUserTotal = (auctionItems: AuctionItem[], user: string): number =>
  auctionItems.reduce((userTotal: number, item: AuctionItem) => {
    const highBid = getHighBid(item.bids);
    return highBid.name === user ? userTotal + highBid.value : userTotal;
  }, 0);

export const createNewAuctionItem = (items: AuctionItem[] = []): AuctionItem => {
  const id = items.length ? Math.max(...items.map(item => item.id)) + 1 : 0;
  return {
    id,
    title: '',
    bids: [{ name: 'min', value: 0 }],
    description: '',
    viewDetails: false,
  };
};
