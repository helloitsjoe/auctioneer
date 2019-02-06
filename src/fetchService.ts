import axios from 'axios';
import { DATA_URL } from './utils';
import { AuctionItem } from './reducers';
import { AxiosAdapter, AxiosPromise } from 'axios';

type DeleteResponse = { deletedItemID: number };

export default class FetchService {
    // Adapter required to get around jest CORS issue with localhost
    // when testing. See server tests for the adapter itself
    constructor(
        private url: string = DATA_URL,
        private adapter?: AxiosAdapter
    ) {}

    fetchItems(): AxiosPromise<AuctionItem[]> {
        return axios.get(this.url, { adapter: this.adapter });
    }

    updateItem(item: AuctionItem): AxiosPromise<AuctionItem> {
        return axios.put(
            `${this.url}/${item.id}`,
            { body: item },
            { adapter: this.adapter }
        );
    }

    deleteItem(itemID: number): AxiosPromise<DeleteResponse> {
        return axios.delete(`${this.url}/${itemID}`, { adapter: this.adapter });
    }
}
