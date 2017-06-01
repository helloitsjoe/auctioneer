import * as React from 'react';
import Nav from './Nav';
import List from './List';
// import data from '../data';
// import auctionData from '../data.json';

export class App extends React.Component<any, any> {
    private refresh:any;
    private data:any;
    private url:string;

    constructor() {
        super();
        this.updateData = this.updateData.bind(this);
        this.url = 'http://localhost:3001/data';
        // this.url = 'https://server-nmpfdegzrw.now.sh/';
        // this.getData();
        this.state = { data: this.getData() };
    }

    getData() {
        return fetch(this.url).then((response) => {
            console.log(response.status);
            response.json().then((jsonData) => {
                console.log(jsonData);
                this.setState({ data: jsonData });
            });
        });
    }

    updateData(newData, i) {
        let data = this.state.data.slice();
        data[i] = newData;
        return fetch(this.url, {
            method: 'POST',
            body: data
        }).then((res) => {
            console.log(res);
            this.setState({ data });
        });
    }

    render() {
        return (
            <div className="u-full-width well">
                <Nav />
                <List data={this.state.data} updateData={this.updateData}/>
            </div>
        );
    }
}
