import * as React from 'react';
import axios from 'axios';
import Nav from './Nav';
import List from './List';

type State = {
    data: any;
    isLoaded: boolean;
}

export class App extends React.Component<any, State> {

    private url: string;

    constructor(props) {
        super(props);

        this.updateData = this.updateData.bind(this);
        this.url = 'http://localhost:3001/data';
        this.state = {
            data: null,
            isLoaded: false,
        };
    }

    public async componentDidMount() {
        const data = await this.getData();
        console.log(data);
        this.setState({ data, isLoaded: true });
    }

    private async getData(): Promise<any> {
        const response = await axios.get(this.url);
        console.log('state data:', response.data);
        return response ? response.data : null;
    }

    private updateData(itemData): void {
        let data = this.state.data.slice();
        data[itemData.id] = itemData;

        this.setState({ data });

        // Fire-and-forget
        axios.put(this.url, {
            body: JSON.stringify(itemData),
        });
    }

    public render() {
        return !this.state.isLoaded ? <div>Loading...</div> : (
            <div className="u-full-width well">
                <Nav />
                <List data={this.state.data} updateData={this.updateData}/>
            </div>
        );
    }
}
