import * as React from 'react';
import { connect } from 'react-redux';

import { getMinBidValue } from '../utils';
import { ItemData, selectFocusedItem, selectFocusedIndex } from '../reducers';
import { inputChange, deleteRequest, submitChange } from '../actions/adminActions';

export enum InputKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    initialItemData: ItemData;
    submitChange: (itemData: ItemData) => void;
    deleteRequest: (id: number) => void;
    onChangeTitle: (e: any) => void;
    onSubmitChanges: (e: any) => void;
}

type State = {
    dirty: boolean,
    // itemData: ItemData
    title: string,
    description: string,
    minBid: number,
    id: number
}

export class ItemEditor extends React.Component<Props, State> {

    // FIXME: Sidebar title changes remain after clicking on another item
    // TODO: Warn if user is going to click away from changes...
    // TODO: Warn if user is trying to add a second item without adding a title/description
    // TODO: Prohibit addItem submit without title and description

    state = {
        dirty: false,
        // itemData: this.props.initialItemData
        title: this.props.initialItemData.title,
        description: this.props.initialItemData.description,
        minBid: getMinBidValue(this.props.initialItemData.bids),
        id: this.props.initialItemData.id
    }

    handleTitle = (e) => {
        const { value: title } = e.target;
        this.setState({ dirty: true, title });
        this.props.onChangeTitle(e);
    }

    handleMinBid = (e) => {
        const { value: minBid } = e.target;
        this.setState({ dirty: true, minBid: Number(minBid) });
    }

    handleDescription = (e) => {
        const { value: description } = e.target;
        this.setState({ dirty: true, description });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ dirty: false });
        const { title, description, minBid } = this.state;
        const bids = this.props.initialItemData.bids.map(bid =>
            bid.name === 'min' ? { ...bid, value: minBid } : bid);
        this.props.submitChange({
            ...this.props.initialItemData,
            title,
            description,
            bids
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initialItemData.id === this.props.initialItemData.id) {
            return;
        }
        const { initialItemData: item } = this.props;
        this.setState({
            title: item.title,
            description: item.description,
            id: item.id,
            minBid: getMinBidValue(item.bids)
        });
    }

    render() {
        const { title, description, minBid } = this.state;
        return (
            <div className="main-item">
                <form action="submit" onSubmit={this.handleSubmit}>
                    <div className="main-element">
                        Title:
                        <input id="title" type="text" value={title} onChange={this.handleTitle} />
                    </div>
                    <div className="main-element">
                        Minimum Bid: $
                        <input
                            id="minimum"
                            type="number"
                            value={minBid}
                            onChange={this.handleMinBid}
                        />
                    </div>
                    <div className="main-element">
                        <p>Description:</p>
                        <textarea
                            form="item-form"
                            name="description"
                            id="description"
                            value={description}
                            onChange={this.handleDescription} />
                    </div>
                    <button id="submit" className="save" type="submit" onClick={this.handleSubmit}>Save</button>
                    <button id="delete" className="u-pull-right delete" type="button" onClick={() => this.props.deleteRequest(this.state.id)}>Delete</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    initialItemData: selectFocusedItem(state)
})

const mapDispatchToProps = {
    submitChange,
    deleteRequest,
    onChangeTitle: (e) => inputChange(e.target.value, InputKey.title),
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemEditor);