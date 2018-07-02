import * as React from 'react';
import Item from './Item';

type Props = {
    data: any;
    updateData: (any) => void;
}

export default class List extends React.Component<Props, any> {

    constructor(props) {
        super(props);
    }

    public render() {
        const items = [].map.call(this.props.data, (datum, i) => (
            <Item
                data={datum}
                key={i}
                id={i}
                updateData={this.props.updateData} />
        ));
        return (
            <div className="list">
                {items}
            </div>
        );
    }
}
