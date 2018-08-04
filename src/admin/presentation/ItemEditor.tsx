import * as React from 'react';
import { ItemData } from '../../containers/App';

type Props = {
    itemData: ItemData;
}

export const ItemEditor = ({ itemData }: Props) => {
    const minBid = itemData.bids.find(bid => bid.name === 'min');
    const minBidValue = minBid ? minBid.bid : 0;

    return <div className="main-item">
        <form action="submit">
            <div className="main-element">
                Title: <input id="title" type="text" defaultValue={itemData.title} />
            </div>
            <div className="main-element">
                Minimum Bid: <input id="minimum" type="number" defaultValue={minBidValue.toString()} />
            </div>
            <div className="main-element"><p>Description:</p><textarea
                form="item-form"
                name="description"
                id="description"
                // rows={4}
                // cols={50}
                defaultValue={itemData.description} /></div>
        </form>
    </div>
}