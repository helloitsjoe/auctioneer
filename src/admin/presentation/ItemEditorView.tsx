import * as React from 'react';

export const ItemEditorView = ({ title, minBid, description, handleChange }) => (
    <div className="main-item">
        <form action="submit">
            <div className="main-element">
                Title:
                <input id="title" type="text" value={title} onChange={handleChange.bind(this, 'title')} />
            </div>
            <div className="main-element">
                Minimum Bid:
                <input id="minimum" type="number" value={minBid} onChange={handleChange.bind(this, 'minBid')} />
            </div>
            <div className="main-element">
                <p>Description:</p>
                <textarea
                    form="item-form"
                    name="description"
                    id="description"
                    value={description}
                    onChange={handleChange.bind(this, 'description')} />
            </div>
        </form>
    </div>
)