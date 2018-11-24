import * as React from 'react';
import { connect } from 'react-redux';

import { getMinBidValue } from '../utils';
import { ItemData, selectFocusedItem } from '../reducers';
import { inputChange, deleteRequest, submitChange } from '../actions/adminActions';

export enum InputKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    itemData: ItemData;
    submitChange: (itemData: ItemData) => void;
    deleteRequest: (id: number) => void;
    onChangeTitle: (e: any) => void;
    onChangeMinBid: (e: any) => void;
    onSubmitChanges: (e: any) => void;
    onChangeDescription: (e: any) => void;
}

export const ItemEditor = ({
    itemData,
    onChangeTitle,
    onChangeDescription,
    onChangeMinBid,
    onSubmitChanges,
    deleteRequest
}: Props) => {

    // TODO: Warn if user is trying to add a second item without adding a title/description
    // TODO: Prohibit addItem submit without title and description

    return (
        <div className="main-item">
            <form action="submit" onSubmit={onSubmitChanges}>
                <div className="main-element">
                    Title:
                    <input id="title" type="text" value={itemData.title} onChange={onChangeTitle} />
                </div>
                <div className="main-element">
                    Minimum Bid: $
                    <input
                        id="minimum"
                        type="number"
                        value={getMinBidValue(itemData.bids)}
                        onChange={onChangeMinBid}
                    />
                </div>
                <div className="main-element">
                    <p>Description:</p>
                    <textarea
                        form="item-form"
                        name="description"
                        id="description"
                        value={itemData.description}
                        onChange={onChangeDescription} />
                </div>
                <button id="submit" className="save" type="submit" onClick={onSubmitChanges}>Save</button>
                <button id="delete" className="u-pull-right delete" type="button" onClick={() => deleteRequest(itemData.id)}>Delete</button>
            </form>
        </div>
    )
}

const mapStateToProps = (state) => ({
    itemData: selectFocusedItem(state),
})

const mapDispatchToProps = {
    submitChange,
    deleteRequest,
    inputChange,
};

export const mergeProps = (stateProps, dispatchProps) => {
    const {itemData} = stateProps;
    const {submitChange, deleteRequest, inputChange} = dispatchProps;
    return {
        itemData,
        deleteRequest,
        onChangeTitle: (e) => inputChange(e.target.value, InputKey.title),
        onChangeMinBid: (e) => inputChange(e.target.value, InputKey.minBid),
        onChangeDescription: (e) => inputChange(e.target.value, InputKey.description),
        onSubmitChanges(e) {
            e.preventDefault();
            submitChange(itemData);
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemEditor);