import * as React from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import { DATA_URL, randFromArr, DEFAULT_NAMES } from '../utils';
import { AdminPage } from '../admin/containers/AdminPage';
import { BidsPage } from './BidsPage';

type State = {
    error: string;
    isLoaded: boolean;
    userTotal: number;
    auctionItems: ItemData[];
}

export type ItemData = {
    id: number;
    bids: Bid[];
    title: string;
    // photos: any[];
    description: string;
}

export type Bid = {
    name: string;
    value: number;
}

export class App extends React.Component<any, State> {

    private auctionDataPoll: any;
    // private dataUrl: string; // TODO: Pass url/port into App

    constructor(props) {
        super(props);

        // this.dataUrl = `${HOST}:${this.props.port}/data`

        this.state = {
            error: null,
            isLoaded: false,
            userTotal: 0,
            auctionItems: null,
        };

        window.sessionStorage.userID = window.sessionStorage.userID || randFromArr(DEFAULT_NAMES);
    }

    public async componentDidMount() {
        await this.fetchAuctionData();
        // Kick off poll every second for new auction data... TODO: Make this a socket?
        this.auctionDataPoll = setInterval(async () => {
            await this.fetchAuctionData();
        }, 1000);
    }

    public componentWillUnmount() {
        clearInterval(this.auctionDataPoll);
    }

    private async fetchAuctionData() {
        try {
            const response = await axios.get(DATA_URL);
            const auctionItems = response && response.data;
            this.setState({ auctionItems, isLoaded: true });
        } catch (err) {
            clearInterval(this.auctionDataPoll);
            console.error(err);
            this.setState({ error: JSON.stringify(err), isLoaded: true });
        }
    }

    public render() {
        return !this.state.isLoaded ? <div>Loading...</div>
            : this.state.error ? <div>Error: {this.state.error}</div>
            : (
                <Router>
                    <div>
                        <Route exact={true} path="/admin" render={() => <AdminPage
                            auctionItems={this.state.auctionItems} poller={this.auctionDataPoll} />} />
                        <Route exact={true} path="/" render={() => <BidsPage
                            auctionItems={this.state.auctionItems}
                            user={window.sessionStorage.userID}
                            // userTotal={this.state.userTotal}
                            filter={false} />} />
                        <Route exact={true} path="/user" render={() => <BidsPage
                            auctionItems={this.state.auctionItems}
                            user={window.sessionStorage.userID}
                            // userTotal={this.state.userTotal}
                            filter={true} />} />
                    </div>
                </Router>
            );
    }
}
