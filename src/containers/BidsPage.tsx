import * as React from 'react';
import Nav from './Nav';
import { List } from './List';
import { Footer } from '../components/Footer';
import { UserNameForm } from '../components/UserNameForm';
import { Route } from 'react-router-dom';

export default class BidsPage extends React.Component<any, any> {

    render() {
        return (
            <div className="well container">
                <UserNameForm />
                <Nav />
                <List data={this.props.auctionItems} filter={this.props.filter}/>
                <Footer userTotal={this.props.userTotal} />
            </div>
        )
    }
}