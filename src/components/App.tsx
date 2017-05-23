import * as React from 'react';
import Nav from './Nav';
import List from './List';

export class App extends React.Component<any, any> {
    render() {
        return (
            <div className="container">
                <div className="six columns well">
                    <Nav />
                    <List />
                </div>
            </div>
        );
    }
}
