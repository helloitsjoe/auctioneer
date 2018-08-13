import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ItemData } from '../../reducers';
import { inputChange, deleteRequest, submitRequest } from '../../actions/adminActions';
import { ItemEditorView } from '../presentation/ItemEditorView';

export enum InputKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    itemData: ItemData;
    submitRequest: (itemData: string) => void;
    handleChange: (key: InputKey, e: any) => void;
    deleteRequest: (id: number) => void;
}

export const ItemEditor = ({ itemData, handleChange, submitRequest, deleteRequest }: Props) => {

    // FIXME: Sidebar title changes remain after clicking on another item
    // TODO: Warn if user is going to click away from changes...
    // TODO: Prohibit addItem submit without title and description

    const submitChanges = (e) => {
        e.preventDefault();
        submitRequest(JSON.stringify(itemData));
    };


    return (
        <ItemEditorView
            itemData={itemData}
            deleteRequest={deleteRequest}
            submitChanges={submitChanges}
            handleChange={handleChange} />
    )
}

const mapStateToProps = state => state;
const mapDispatchToProps = (dispatch) => ({
    handleChange: (key: InputKey, e: any) => dispatch(inputChange(key, e.target.value)),
    deleteRequest: (id: number) => dispatch(deleteRequest(id)),
    submitRequest: (itemData: string) => dispatch(submitRequest(itemData))
});

const ConnectedEditor = connect(mapStateToProps, mapDispatchToProps)(ItemEditor);
export default ConnectedEditor;