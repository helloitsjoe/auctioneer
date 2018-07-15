import * as React from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';
import { List } from './List';
import { UserList } from './UserList';
import { DATA_URL } from '../utils';

type State = {
    data: any;
    isLoaded: boolean;
}

export class App extends React.Component<any, State> {

    constructor(props) {
        super(props);

        // TODO: Don't use localStorage to store userID
        // TODO: Don't hardcode userID
        window.localStorage.userID = 'user01';

        this.state = {
            data: null,
            isLoaded: false,
        };
    }

    public async componentDidMount() {
        const response = await axios.get(DATA_URL);
        const data = response && response.data;
        console.log('state data:', data);
        this.setState({ data, isLoaded: true });
    }

    public render() {
        return !this.state.isLoaded ? <div>Loading...</div> : (
            <Router>
            <div className="well">
                <Nav />
                <Route exact="true" path="/" render={() => <List data={this.state.data} />} />
                <Route exact="true" path="/user" render={() => <UserList data={this.state.data} />} />
            </div>
            </Router>
        );
    }
}
