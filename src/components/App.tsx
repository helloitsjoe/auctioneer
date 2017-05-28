import * as React from 'react';
import Nav from './Nav';
import List from './List';
import data from '../data';

export class App extends React.Component<any, any> {
    private refresh:any;

    constructor() {
        super();
        this.state = { data };
    }

    // componentDidMount() {
    //     this.refresh = setInterval(() => {
    //         // Will this update the data from data.ts?
    //         this.setState({ data });
    //     }, 3000);
    // }

    clicked() {
        // this.setState({ data.bids })
    }

    render() {
        return (
            <div className="container">
                <div className="twelve columns well">
                    <Nav />
                    <List data={this.state.data} onQuickBid={this.clicked}/>
                </div>
            </div>
        );
    }
}
