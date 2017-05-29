import * as React from 'react';
import Nav from './Nav';
import List from './List';
import data from '../data';

export class App extends React.Component<any, any> {
    private refresh:any;
    private data:any;

    constructor() {
        super();
        this.updateData = this.updateData.bind(this);
        this.state = { data };
    }

    updateData(newData, i) {
        let data = this.state.data.slice();
        data[i] = newData;
        this.setState({ data });
    }

    render() {
        return (
            <div className="container">
                <div className="twelve columns well">
                    <Nav />
                    <List data={this.state.data} updateData={this.updateData}/>
                </div>
            </div>
        );
    }
}
