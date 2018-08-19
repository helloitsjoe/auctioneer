import * as React from 'react';
import { connect } from 'react-redux';

import { ItemData } from '../../reducers';
import { inputChange, deleteRequest, putRequest } from '../../actions/adminActions';
import { ItemEditorView } from '../presentation/ItemEditorView';

export enum InputKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    itemData: ItemData;
    putRequest: (itemData: ItemData) => void;
    handleChange: (key: InputKey, e: any) => void;
    deleteRequest: (id: number) => void;
}

export const ItemEditor = ({ itemData, handleChange, putRequest, deleteRequest }: Props) => {

    // FIXME: Sidebar title changes remain after clicking on another item
    // TODO: Warn if user is going to click away from changes...
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
            handleChange={handleChange} />
    )
}

const mapStateToProps = state => state;
const mapDispatchToProps = (dispatch) => ({
    handleChange: (key: InputKey, e: any) => dispatch(inputChange(key, e.target.value)),
    deleteRequest: (id: number) => dispatch(deleteRequest(id)),
    putRequest: (itemData: string) => dispatch(putRequest(itemData))
});

const ConnectedEditor = connect(mapStateToProps, mapDispatchToProps)(ItemEditor);
export default ConnectedEditor;