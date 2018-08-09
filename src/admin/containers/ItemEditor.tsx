import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ItemData } from '../../reducers';
import { inputChange } from '../../actions/adminActions';
import { ItemEditorView } from '../presentation/ItemEditorView';

export enum InputKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    itemData: ItemData;
    submitChanges: (e: any) => void;
    handleChange: (key: InputKey, e: any) => void;
}

export const ItemEditor = ({ itemData, handleChange, submitChanges }: Props) => {

    // FIXME: Sidebar title changes remain after clicking on another item
    // TODO: Warn if user is going to click away from changes...
    // TODO: Prohibit addItem submit without title and description

    return (
        <ItemEditorView
            itemData={itemData}
            submitChanges={submitChanges}
            handleChange={handleChange} />
    )
}

const mapStateToProps = state => state;
const mapDispatchToProps = (dispatch) => ({
    handleChange: (key: InputKey, e: any) => dispatch(inputChange(key, e.target.value))
});

const ConnectedEditor = connect(mapStateToProps, mapDispatchToProps)(ItemEditor);
export default ConnectedEditor;