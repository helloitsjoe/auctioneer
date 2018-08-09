import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ItemData } from '../../reducers/auctionItemsReducer';
import { inputChange } from '../../actions/adminActions';
import { ItemEditorView } from '../presentation/ItemEditorView';

export enum InputKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    itemData: ItemData;
    dispatch: Dispatch;
    submitChanges: (e: any) => void;
}

export const ItemEditor = ({ itemData, dispatch, submitChanges }: Props) => {

    const handleChange = (key: string, e: any) => {
        const { value } = e.target;
        dispatch(inputChange(key, value));
    }
    
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

const ConnectedEditor = connect(mapStateToProps)(ItemEditor);
export default ConnectedEditor;