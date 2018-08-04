import * as React from 'react';
import { ItemData } from '../../containers/App';
import { getMinBidValue } from '../../utils';
import { ItemEditorView } from '../presentation/ItemEditorView';

type Props = {
    itemData: ItemData;
}

type State = {
    id: number;
    title: string;
    minBid: number;
    description: string;
}

// export const ItemEditor = ({ itemData }: Props) => {
export class ItemEditor extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        const { itemData } = this.props;
        const { id, title, bids, description } = itemData;

        this.state = {
            id,
            title,
            description,
            minBid: getMinBidValue(bids),
        }
    }

    handleChange = (stateKey: string, e) => {
        const newState = {};
        newState[stateKey] = e.target.value;
        this.setState(newState);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        const { itemData } = nextProps;
        const { id, bids, title, description } = itemData;

        // Only rerender if the item id is different
        if (id === prevState.id) {
            return null;
        }
        return {
            id,
            title,
            description,
            minBid: getMinBidValue(bids),
        };
    }

    render() {
        const { title, minBid, description } = this.state;

        return (
            <ItemEditorView
                title={title}
                minBid={minBid}
                description={description}
                handleChange={this.handleChange} />
        )
    }
}