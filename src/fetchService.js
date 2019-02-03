import axios from 'axios';

export default class FetchService {
    constructor(adapter) {
        // Adapter required to get around jest CORS issue with localhost
        // when testing. See server tests for the adapter itself
        this.adapter = adapter;
    }

    get(url) {
        return axios.get(url, { adapter: this.adapter });
    }

    put(url, { body }) {
        return axios.put(url, { body }, { adapter: this.adapter });
    }

    delete(url) {
        return axios.delete(url, { adapter: this.adapter });
    }
}
