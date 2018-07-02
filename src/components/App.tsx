import * as React from 'react';
import axios from 'axios';
import Nav from './Nav';
import List from './List';

type State = {
    data: any;
}

type Props = {}

export class App extends React.Component<Props, State> {

    private url: string;

    constructor(props) {
        super(props);

        this.updateData = this.updateData.bind(this);
        this.url = 'http://localhost:3001/data';
        this.state = { data: this.getData() };
    }

    private async getData(): Promise<void> {
        const data = await axios.get(this.url);
        console.log('state data:', data);
        this.setState(data);
    }

    private async updateData(itemData/*, i*/): Promise<void> {
        let data = this.state.data.slice();
        data[itemData.id] = itemData;
        await axios.put(this.url, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData),
        });
        this.setState({ data });
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
