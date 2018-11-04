import { Dispatch } from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Poller } from './Poller';
import { BidsPage } from './user/BidsPage';
import { randFromArr, DEFAULT_NAMES, DATA_URL } from './utils';
import { AdminPage } from './admin/AdminPage';
import { setAuctionData, setAuctionError } from './actions/auctionItemActions';
import { ItemData, selectError, selectIsLoaded, selectAuctionItems } from './reducers';

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
        const name = sessionStorage.getItem('userName') || randFromArr(DEFAULT_NAMES).toUpperCase();
        sessionStorage.setItem('userName', name);
    }

    async componentDidMount() {
        await this.fetchAuctionData();
        // Kick off poll every second for new auction data... TODO: Make this a socket?
        this.auctionDataPoll.start();
    }

    componentWillUnmount() {
        this.auctionDataPoll.stop();
    }

    componentDidCatch(err, info) {
        console.error(err, info);
    }

    fetchAuctionData = async () => {
        try {
            const response = await this.props.axios.get(DATA_URL);
            const auctionItems = response && response.data;
            this.props.dispatch(setAuctionData(auctionItems, sessionStorage.getItem('userName')));
        } catch (err) {
            console.error(err);
            this.props.dispatch(setAuctionError(err.message));
            this.auctionDataPoll.stop();
        }
    }

    render() {
        const { error, isLoaded, auctionItems } = this.props;

        return !isLoaded ? <div>Loading...</div>
            : error ? <div>Error: {JSON.stringify(error)}</div>
            : (
                <Router>
                    <Switch>
                        <Route exact path="/admin" render={() => 
                            <AdminPage poller={this.auctionDataPoll} />} />
                        <Route path="/" render={({location}) => 
                            <BidsPage
                                poller={this.auctionDataPoll}
                                auctionItems={auctionItems}
                                user={sessionStorage.getItem('userName')}
                                filter={location.pathname === '/user'} />} />
                    </Switch>
                </Router>
            );
    }
}

const mapStateToProps = state => ({
  error: selectError(state),
  isLoaded: selectIsLoaded(state),
  auctionItems: selectAuctionItems(state)
})

export default connect(mapStateToProps)(App);