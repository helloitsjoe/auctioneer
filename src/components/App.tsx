import * as React from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';
import { List } from './List';
import { Footer } from './Footer';
import { UserList } from './UserList';
import { UserNameForm } from './UserNameForm';
import { DATA_URL, randFromArr, DEFAULT_NAMES } from '../utils';

type State = {
    error: string;
    isLoaded: boolean;
    userTotal: number;
    auctionItems: any;
}

export class App extends React.Component<any, State> {

    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            userTotal: 0,
            auctionItems: null,
        };

        window.sessionStorage.userID = window.sessionStorage.userID || randFromArr(DEFAULT_NAMES);
    }

    public async componentDidMount() {
        try {
            const response = await axios.get(DATA_URL);
            const auctionItems = response && response.data;
            // TODO: Don't use sessionStorage to store userID
            console.log('state data:', auctionItems);
            this.setState({ auctionItems, isLoaded: true });
        } catch (err) {
            console.error(err);
            this.setState({ error: JSON.stringify(err), isLoaded: true });
        }
    }

    public render() {
        // I could use a filtering button instead of Routes, just wanted to experiment with React Router
        return !this.state.isLoaded ? <div>Loading...</div>
            : this.state.error ? <div>Error: {this.state.error}</div>
            : (
                <Router>
                    <div className="well">
                        <UserNameForm />
                        <Nav />
                        <Route exact={true} path="/" render={() => <List data={this.state.auctionItems} />} />
                        <Route exact={true} path="/user" render={() => <UserList data={this.state.auctionItems} />} />
                        <Footer userTotal={this.state.userTotal} />
                    </div>
                </Router>
            );
    }
}
