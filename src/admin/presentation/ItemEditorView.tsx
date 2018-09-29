import * as React from 'react';
import { getMinBidValue } from '../../utils';
import { InputKey } from '../containers/ItemEditor';
import { ItemData } from '../../reducers';

type Props = {
    itemData: ItemData;
    onInputChange: (e: any, inputKey: string) => void;
    submitChanges: (e: any) => void;
    deleteRequest: (id: number) => void;
}

export const ItemEditorView = ({ itemData, onInputChange, submitChanges, deleteRequest }: Props) => (
    <div className="main-item">
        <form action="submit" onSubmit={submitChanges}>
            <div className="main-element">
                Title:
                <input id="title" type="text" value={itemData.title} onChange={e => onInputChange(e, InputKey.title)} />
            </div>
            <div className="main-element">
                Minimum Bid: $
                <input id="minimum" type="number" value={getMinBidValue(itemData.bids)} onChange={e => onInputChange(e, InputKey.minBid)} />
            </div>
            <div className="main-element">
                <p>Description:</p>
                <textarea
                    form="item-form"
                    name="description"
                    id="description"
                    value={itemData.description}
                    onChange={e => onInputChange(e, InputKey.description)} />
            </div>
            <button id="submit" className="save" type="submit" onClick={submitChanges}>Save</button>
            <button id="delete" className="u-pull-right delete" type="button" onClick={() => deleteRequest(itemData.id)}>Delete</button>
        </form>
    </div>
)