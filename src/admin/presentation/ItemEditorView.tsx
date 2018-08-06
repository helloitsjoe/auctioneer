import * as React from 'react';
import { StateKey } from '../containers/ItemEditor';

type Props = {
    title: string;
    minBid: number;
    description: string;
    handleChange: (stateKey: string, e: any) => void;
    submitChanges: (e: any) => void;
}

export const ItemEditorView = ({ title, minBid, description, handleChange, submitChanges }: Props) => (
    <div className="main-item">
        <form action="submit" onSubmit={submitChanges}>
            <div className="main-element">
                Title:
                <input id="title" type="text" value={title} onChange={handleChange.bind(this, StateKey.title)} />
            </div>
            <div className="main-element">
                Minimum Bid: $
                <input id="minimum" type="number" value={minBid} onChange={handleChange.bind(this, StateKey.minBid)} />
            </div>
            <div className="main-element">
                <p>Description:</p>
                <textarea
                    form="item-form"
                    name="description"
                    id="description"
                    value={description}
                    onChange={handleChange.bind(this, StateKey.description)} />
            </div>
            <input id="submit" type="submit" onClick={submitChanges} value="Submit"/>
        </form>
    </div>
)