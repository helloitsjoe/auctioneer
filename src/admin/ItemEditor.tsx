import * as React from 'react';
import { connect } from 'react-redux';

import { ItemData } from '../reducers';
import { inputChange, deleteRequest, putRequest } from '../actions/adminActions';
import { ItemEditorView } from './ItemEditorView';

export enum InputKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    itemData: ItemData;
    putRequest: (itemData: ItemData) => void;
    onInputChange: (e: any, key: InputKey) => void;
    deleteRequest: (id: number) => void;
}

export const ItemEditor = ({ itemData, onInputChange, putRequest, deleteRequest }: Props) => {

    // FIXME: Sidebar title changes remain after clicking on another item
    // TODO: Warn if user is going to click away from changes...
    // TODO: Warn if user is trying to add a second item without adding a title/description
    // TODO: Prohibit addItem submit without title and description

    const submitChanges = (e) => {
        e.preventDefault();
        putRequest(itemData);
    };


    return (
        <ItemEditorView
            itemData={itemData}
            deleteRequest={deleteRequest}
            submitChanges={submitChanges}
            onInputChange={onInputChange} />
    )
}

const mapStateToProps = state => state;
const mapDispatchToProps = {
    onInputChange: (e: any, key: InputKey) => inputChange(e.target.value, key),
    deleteRequest,
    putRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemEditor);