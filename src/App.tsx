import * as React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Poller } from './Poller';
import { BidsPage } from './user/BidsPage';
import { randFromArr, DEFAULT_NAMES } from './utils';
import { AdminPage } from './admin/AdminPage';
import { fetchAuctionData } from './actions/auctionItemActions';
import { ItemData, selectError, selectIsLoaded, selectAuctionItems } from './reducers';

type Props = {
    axios: any
    error: Error,
    isLoaded: boolean,
    auctionItems: ItemData[],
    fetchAuctionData: (userName: string) => void;
    poller: Poller,
}

export class App extends React.Component<Props> {

    static defaultProps = {
        poller: new Poller(),
        axios: axios,
    }

    constructor(props) {
        super(props);
        const userName = sessionStorage.getItem('userName') || randFromArr(DEFAULT_NAMES).toUpperCase();
        sessionStorage.setItem('userName', userName);
    }

    async componentDidMount() {
        // Kick off poll every second for new auction data... TODO: Make this a socket?
        this.props.poller.init(this.props.fetchAuctionData);
    }

    componentWillUnmount() {
        this.props.poller.stop();
    }

    render() {
        const { error, isLoaded, auctionItems, poller } = this.props;

        if (error) {
            poller.stop();
        }

        return !isLoaded ? <div>Loading...</div>
            : error ? <div>Error: {JSON.stringify(error)}</div>
            : (
                <Router>
                    <Switch>
                        <Route exact path="/admin" render={() => 
                            <AdminPage
                                poller={this.props.poller}
                            />
                        } />
                        <Route path="/" render={({location}) => 
                            <BidsPage
                                poller={this.props.poller}
                                auctionItems={auctionItems}
                                user={sessionStorage.getItem('userName')}
                                filter={location.pathname === '/user'}
                            />
                        } />
                    </Switch>
                </Router>
            );
    }
}

const mapStateToProps = state => ({
  error: selectError(state),
  isLoaded: selectIsLoaded(state),
  auctionItems: selectAuctionItems(state)
});

const mapDispatchToProps = {
    fetchAuctionData: () => fetchAuctionData(sessionStorage.getItem('userName'))
};

export default connect(mapStateToProps, mapDispatchToProps)(App);