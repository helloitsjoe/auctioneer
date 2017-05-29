import * as React from 'react';
import Item from './Item';

export default class List extends React.Component<any, any> {
    render() {
        let items = [];
        for (let i = 0, datum; datum = this.props.data[i]; i++) {
            items.push(<Item
                data={datum}
                key={i}
                id={i}
                updateData={this.props.updateData} />);
        }
        return (
            <div className="list">
                {items}
            </div>
        );
    }
}
