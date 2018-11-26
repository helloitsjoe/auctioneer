import * as React from 'react';
import { connect } from 'react-redux';

import { getMinBidValue } from '../utils';
// import { ItemData, selectFocusedItem } from '../reducers';
// import { inputChange, deleteRequest, submitChange, missingInfo } from '../actions/adminActions';

export enum InputKey {
    title = 'title',
    minBid = 'minBid',
    description = 'description',
}

type Props = {
    // itemData: ItemData;
    title: string;
    minBid: number;
    description: string;
    onSubmit: (e: any) => void;
    onChangeTitle: (e: any) => void;
    onChangeMinBid: (e: any) => void;
    onChangeDescription: (e: any) => void;
    onDeleteRequest: (e: any) => void;
}

export function ItemEditor({
    // itemData,
    title,
    minBid,
    description,
    onSubmit,
    onChangeTitle,
    onChangeMinBid,
    onChangeDescription,
    onDeleteRequest,
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
                <button id="delete" className="u-pull-right delete" type="button" onClick={onDeleteRequest}>Delete</button>
            </form>
        </div>
    )
}

// const mapStateToProps = (state) => ({
//     itemData: selectFocusedItem(state),
// })

// const mapDispatchToProps = {
//     inputChange,
//     missingInfo,
//     submitChange,
//     deleteRequest,
// };

// export const mergeProps = (stateProps, dispatchProps) => {
//     const {itemData} = stateProps;
//     const {submitChange, deleteRequest, inputChange, missingInfo} = dispatchProps;
//     return {
//         itemData,
//         deleteRequest,
//         onChangeTitle: (e) => inputChange(e.target.value, InputKey.title),
//         onChangeMinBid: (e) => inputChange(e.target.value, InputKey.minBid),
//         onChangeDescription: (e) => inputChange(e.target.value, InputKey.description),
//         onSubmitChanges(e) {
//             e.preventDefault();
//             if (!(itemData.title.trim() && itemData.description.trim())) {
//                 return missingInfo();
//             }
//             submitChange(itemData);
//         },
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemEditor);