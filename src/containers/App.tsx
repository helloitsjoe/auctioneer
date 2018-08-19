import { Dispatch } from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Poller } from '../Poller';
import { BidsPage } from './BidsPage';
import { randFromArr, DEFAULT_NAMES, DATA_URL } from '../utils';
import ConnectedAdminPage from '../admin/containers/AdminPage';
import { setAuctionData, setAuctionError } from '../actions/auctionItemActions';
import { ItemData } from '../reducers';

type Props = {
    axios: any
    error: Error,
    isLoaded: boolean,
    auctionItems: ItemData[],
    dispatch: Dispatch
}

export class App extends React.Component<Props, any> {

    private auctionDataPoll: Poller;

    constructor(props) {
        super(props);
        // TODO: Might be able to simplify by moving polling to BidsPage
        this.auctionDataPoll= new Poller(this.fetchAuctionData);
        window.sessionStorage.userName = window.sessionStorage.userName || randFromArr(DEFAULT_NAMES).toUpperCase();
    }

    public async componentDidMount() {
        await this.fetchAuctionData();
        // Kick off poll every second for new auction data... TODO: Make this a socket?
        this.auctionDataPoll.start();
    }

    public componentWillUnmount() {
        this.auctionDataPoll.stop();
    }

    private fetchAuctionData = async () => {
        try {
            const response = await this.props.axios.get(DATA_URL);
            const auctionItems = response && response.data;
            this.props.dispatch(setAuctionData(auctionItems, window.sessionStorage.userName));
        } catch (err) {
            console.error(err);
            this.props.dispatch(setAuctionError(err.message));
            this.auctionDataPoll.stop();
        }
    }

    public render() {
        const { error, isLoaded, auctionItems } = this.props;
        // console.log(`App.tsx isLoaded:`, isLoaded);

        return !isLoaded ? <div>Loading...</div>
            : error ? <div>Error: {JSON.stringify(error)}</div>
            : (<Router>
                    <div>
                        <Route exact path="/admin" render={() => 
                            <ConnectedAdminPage poller={this.auctionDataPoll} auctionItems={auctionItems} />} />
                        <Route exact path="/" render={() =>
                            <BidsPage
                                poller={this.auctionDataPoll}
                                auctionItems={auctionItems}
                                user={window.sessionStorage.userName}
                                filter={false} />} />
                        <Route exact path="/user" render={() =>
                            <BidsPage
                                poller={this.auctionDataPoll}
                                auctionItems={auctionItems}
                                user={window.sessionStorage.userName}
                                filter={true} />} />
                    </div>
                </Router>);
    }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(App);