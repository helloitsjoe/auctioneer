import * as React from 'react';
import { ItemData } from '../reducers';
import { getMinBidValue } from '../utils';

export enum InputKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    item: ItemData;
    onSubmit: (e: any) => void;
    onChangeTitle: (e: any) => void;
    onChangeMinBid: (e: any) => void;
    onChangeDescription: (e: any) => void;
    onDelete: (e: any) => void;
}

export function ItemEditor({
    item,
    onSubmit,
    onChangeTitle,
    onChangeMinBid,
    onChangeDescription,
    onDelete,
}: Props) {

    return (
        <div className="main-item">
            <form action="submit" onSubmit={onSubmit}>
                <div className="main-element">
                    Title:
                    <input id="title" type="text" value={item.title} onChange={onChangeTitle} />
                </div>
                <div className="main-element">
                    Minimum Bid: $
                    <input
                        id="minimum"
                        type="number"
                        value={getMinBidValue(item.bids)}
                        onChange={onChangeMinBid}
                    />
                </div>
                <div className="main-element">
                    <p>Description:</p>
                    <textarea
                        form="item-form"
                        name="description"
                        id="description"
                        value={item.description}
                        onChange={onChangeDescription} />
                </div>
                <button id="submit" className="save" type="submit" onClick={onSubmit}>Save</button>
                <button id="delete" className="u-pull-right delete" type="button" onClick={onDelete}>Delete</button>
            </form>
        </div>
    )
}
