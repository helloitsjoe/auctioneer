import * as React from 'react';
import axios from 'axios';
import { ItemData } from '../../containers/App';
import { DATA_URL, getMinBidValue } from '../../utils';
import { ItemEditorView } from '../presentation/ItemEditorView';

export enum StateKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    itemData: ItemData;
    updateTitle: (title: string, id: number) => void;
}

type State = {
    id: number;
    title: string;
    minBid: number;
    description: string;
}

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

    handleChange = (stateKey: string, e: any) => {
        const { value } = e.target;
        const newState = {};

        // TODO: Write test checking for number type
        newState[stateKey] = stateKey === StateKey.minBid ? parseInt(value) : value;

        // Seems like there is probably a better way to pass this up to AdminPage
        // FIXME: Sidebar title changes remain after clicking on another item
        if (stateKey === StateKey.title) {
            this.props.updateTitle(value, this.state.id);
        }
        this.setState(newState);
    }

    submitChanges = (e) => {
        e.preventDefault();
        this.props.itemData.bids[0].value = this.state.minBid;
        const body = Object.assign({}, this.props.itemData, this.state);

        axios.put(DATA_URL, { body: JSON.stringify(body) });
    }

    // TODO: Warn if user is going to click away from changes...
    // Need to connect Sidebar item with ItemEditor, Redux would probably be best

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        const { itemData } = nextProps;
        const { id, bids, title, description } = itemData;

        // Only rerender if the item id is different
        if (id !== prevState.id) {
            return {
                id,
                title,
                description,
                minBid: getMinBidValue(bids),
            };    
        }
        return null;
    }

    render() {
        const { title, minBid, description } = this.state;

        return (
            <ItemEditorView
                submitChanges={this.submitChanges}
                title={title}
                minBid={minBid}
                description={description}
                handleChange={this.handleChange} />
        )
    }
}