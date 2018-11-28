import * as React from 'react';

export enum InputKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    title: string;
    minBid: number;
    description: string;
    onSubmit: (e: any) => void;
    onChangeTitle: (e: any) => void;
    onChangeMinBid: (e: any) => void;
    onChangeDescription: (e: any) => void;
    onDelete: (e: any) => void;
}

export function ItemEditor({
    title,
    minBid,
    description,
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
                    <input id="title" type="text" value={title} onChange={onChangeTitle} />
                </div>
                <div className="main-element">
                    Minimum Bid: $
                    <input
                        id="minimum"
                        type="number"
                        value={minBid}
                        onChange={onChangeMinBid}
                    />
                </div>
                <div className="main-element">
                    <p>Description:</p>
                    <textarea
                        form="item-form"
                        name="description"
                        id="description"
                        value={description}
                        onChange={onChangeDescription} />
                </div>
                <button id="submit" className="save" type="submit" onClick={onSubmit}>Save</button>
                <button id="delete" className="u-pull-right delete" type="button" onClick={onDelete}>Delete</button>
            </form>
        </div>
    )
}
