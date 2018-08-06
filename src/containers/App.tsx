import * as React from 'react';
import { connect } from 'react-redux';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import { randFromArr, DEFAULT_NAMES } from '../utils';
import { AdminPage } from '../admin/containers/AdminPage';
import { BidsPage } from './BidsPage';
import { fetchAuctionItems } from '../actions/auctionItemActions';

// type State = {
//     error: string;
//     isLoaded: boolean;
//     userTotal: number;
//     auctionItems: ItemData[];
// }

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

export class App extends React.Component<any, void> {

    private auctionDataPoll: any;

    constructor(props) {
        super(props);

        // this.state = {
        //     error: null,
        //     isLoaded: false,
        //     userTotal: 0,
        //     auctionItems: null,
        // };

        window.sessionStorage.userID = window.sessionStorage.userID || randFromArr(DEFAULT_NAMES).toUpperCase();
    }

    public async componentDidMount() {
        this.props.dispatch(fetchAuctionItems());
        // Kick off poll every second for new auction data... TODO: Make this a socket?
        this.auctionDataPoll = setInterval(() => {
            this.props.dispatch(fetchAuctionItems());
        }, 1000);
    }

    public componentWillUnmount() {
        clearInterval(this.auctionDataPoll);
    }

    // private async fetchAuctionData() {
    //     try {
    //         const response = await axios.get(DATA_URL);
    //         const auctionItems = response && response.data;
    //         this.setState({ auctionItems, isLoaded: true });
    //     } catch (err) {
    //         clearInterval(this.auctionDataPoll);
    //         console.error(err);
    //         this.setState({ error: JSON.stringify(err), isLoaded: true });
    //     }
    // }

    public render() {
        const { error, isLoaded, auctionItems } = this.props;
        console.log(`App.tsx isLoaded:`, isLoaded);

        if (error) {
            clearInterval(this.auctionDataPoll);
            console.error(error);
        }
        return !isLoaded ? <div>Loading...</div>
            : error ? <div>Error: {JSON.stringify(error)}</div>
            : (<Router>
                    <div>
                        <Route exact path="/admin"
                            render={() => <AdminPage auctionItems={auctionItems} />} />
                        <Route exact path="/" render={() => <BidsPage
                            auctionItems={auctionItems}
                            user={window.sessionStorage.userID}
                            filter={false} />} />
                        <Route exact path="/user" render={() => <BidsPage
                            auctionItems={auctionItems}
                            user={window.sessionStorage.userID}
                            filter={true} />} />
                    </div>
                </Router>);
    }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(App);