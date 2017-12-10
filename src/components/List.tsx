import * as React from 'react';
import Item from './Item';

export default class List extends React.Component<any, any> {
    render() {
        const updateData = this.props.updateData;
        const items = [].map.call(this.props.data, (datum, i) => (
            <Item
                data={datum}
                key={i}
                id={i}
                updateData={updateData} />
        ));
        return (
            <div className="list">
                {items}
            </div>
        );
    }
}
