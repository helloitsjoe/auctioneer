import * as React from 'react';
import Item from './Item';
import data from '../data';

export default class List extends React.Component<any, any> {
    render() {
        return (
            <div className="list">
                <Item />
                <Item />
                <Item />
                <Item />
                <Item />
            </div>
        );
        // data.forEach((item) => {
        //     return <Item />
        // });
    }
}
