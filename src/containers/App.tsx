import axios from "axios";
import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { randFromArr, DEFAULT_NAMES, DATA_URL } from '../utils';
import { AdminPage } from '../admin/containers/AdminPage';
import { BidsPage } from './BidsPage';
import { setAuctionData, setAuctionError } from '../actions/auctionItemActions';

export class App extends React.Component<any, any> {

    private auctionDataPoll: any;

    constructor(props) {
        super(props);

        window.sessionStorage.userID = window.sessionStorage.userID || randFromArr(DEFAULT_NAMES).toUpperCase();
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
            this.props.dispatch(setAuctionData(auctionItems));
        } catch (err) {
            clearInterval(this.auctionDataPoll);
            console.error(err);
            this.props.dispatch(setAuctionError(JSON.stringify(err)));
        }
    }

    public render() {
        const { error, isLoaded, auctionItems } = this.props;
        // console.log(`App.tsx isLoaded:`, isLoaded);

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