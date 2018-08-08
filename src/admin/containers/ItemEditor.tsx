import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ItemEditorView } from '../presentation/ItemEditorView';
import { inputChange } from '../../actions/adminActions';
import { ItemData, getMinBidValue } from '../../reducers/auctionItemsReducer';

export enum StateKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    itemData: ItemData;
    dispatch: Dispatch;
    // updateTitle: (title: string, id: number) => void;
    submitChanges: (itemState: any, e: any) => void;
}

// type State = {
//     id: number;
//     title: string;
//     minBid: number;
//     description: string;
// }

export class ItemEditor extends React.Component<Props, null> {

    constructor(props) {
        super(props);

        const { itemData } = this.props;
        const { id, title, bids, description } = itemData;

        // this.state = {
        //     id,
        //     title,
        //     description,
        //     minBid: getMinBidValue(bids),
        // }
    }

    handleChange = (key: string, e: any) => {
        const { value } = e.target;
        const newState = {};

        // TODO: Write test checking for number type
        // newState[stateKey] = stateKey === StateKey.minBid ? parseInt(value) : value;

        // Seems like there is probably a better way to pass this up to AdminPage
        // FIXME: Sidebar title changes remain after clicking on another item
        // if (stateKey === StateKey.title) {
            // TODO: Might not need this check
            // this.props.dispatch(updateTitle(value))
            // this.props.updateTitle(value, this.state.id);
        // }
        this.props.dispatch(inputChange(key, value));
        // this.setState(newState);
    }

    // TODO: Warn if user is going to click away from changes...
    // Need to connect Sidebar item with ItemEditor, Redux would probably be best

    // static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    //     const { itemData } = nextProps;
    //     console.log(`itemData:`, itemData);
    //     const { id, bids, title, description } = itemData;

    //     // Only rerender if the item id is different
    //     if (id !== prevState.id) {
    //         return {
    //             id,
    //             title,
    //             description,
    //             minBid: getMinBidValue(bids),
    //         };    
    //     }
    //     return null;
    // }

    render() {
        const { itemData } = this.props;
        const { title, description } = itemData;
        const minBid = getMinBidValue(itemData.bids);

        return (
            <ItemEditorView
                submitChanges={this.props.submitChanges.bind(this, this.state)}
                title={title}
                minBid={minBid}
                description={description}
                handleChange={this.handleChange} />
        )
    }
}

const mapStateToProps = state => state;

const ConnectedEditor = connect(mapStateToProps)(ItemEditor);
export default ConnectedEditor;