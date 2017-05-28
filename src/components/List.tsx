import * as React from 'react';
import Item from './Item';
// import data from '../data';

export default class List extends React.Component<any, any> {
    render() {
        let data = this.props.data;
        let items = [];
        for (let i = 0, datum; datum = data[i]; i++) {
            let bids = [];
            for (let j = 0; j < datum.bids.length; j++) {
                bids.push(datum.bids[j].bid);
            }
            console.log('BIDS', bids);
            let highBid = Math.max.apply(null, bids);
            console.log(highBid);
            items.push(<Item
                title={datum.title}
                description={datum.description}
                key={i}
                id={i}
                bids={bids}
                highBid={highBid} />);
        }
        return (
            <div className="list">
                {items}
            </div>
        );
    }
}
