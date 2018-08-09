import * as React from 'react';
import { getMinBidValue } from '../../utils';
import { InputKey } from '../containers/ItemEditor';
import { ItemData } from '../../reducers/auctionItemsReducer';

type Props = {
    itemData: ItemData;
    handleChange: (inputKey: string, e: any) => void;
    submitChanges: (e: any) => void;
}

export const ItemEditorView = ({ itemData, handleChange, submitChanges }: Props) => (
    <div className="main-item">
        <form action="submit" onSubmit={submitChanges}>
            <div className="main-element">
                Title:
                <input id="title" type="text" value={itemData.title} onChange={handleChange.bind(this, InputKey.title)} />
            </div>
            <div className="main-element">
                Minimum Bid: $
                <input id="minimum" type="number" value={getMinBidValue(itemData.bids)} onChange={handleChange.bind(this, InputKey.minBid)} />
            </div>
            <div className="main-element">
                <p>Description:</p>
                <textarea
                    form="item-form"
                    name="description"
                    id="description"
                    value={itemData.description}
                    onChange={handleChange.bind(this, InputKey.description)} />
            </div>
            <input id="submit" type="submit" onClick={submitChanges} value="Submit"/>
        </form>
    </div>
)