import * as React from 'react';
import {connect} from 'react-redux';
import {submitChange, deleteRequest } from '../actions/adminActions';
import {ItemData, Modal, selectAuctionItems} from '../reducers';

import { ItemEditor, InputKey } from './ItemEditor';
import { Poller } from '../Poller';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { ConfirmDiscard } from './ConfirmDiscard';
import { MissingInfoNotice } from './MissingInfoNotice';
import { createNewAuctionItem, getMinBidValue } from '../utils';

type Props = {
    poller: Poller;
    initialItems: ItemData[];
    submitChange: (item: ItemData) => void;
    deleteRequest: (id: number) => Promise<number>;
}

type State = {
    items: ItemData[];
    title: string;
    dirty: boolean;
    minBid: number;
    description: string;
    focusedIndex: number;
    missingInfo: boolean;
    confirmDiscard: boolean;
}


export class AdminPage extends React.Component<Props, State> {

    static defaultProps = {
        poller: new Poller()
    }

    state = {
        items: [],
        title: '',
        dirty: false,
        minBid: 0,
        description: '',
        focusedIndex: 0,
        missingInfo: false,
        confirmDiscard: false,
    }

    componentDidMount() {
        this.props.poller.stop();
        const { initialItems } = this.props;
        const item = initialItems[this.state.focusedIndex];
        const { title, description } = item;
        const minBid = getMinBidValue(item.bids);
        this.setState({
            items: initialItems,
            description,
            minBid,
            title,
        });
    }

    handleInputChange = (inputType: InputKey) => e => {
        const { value } = e.target;
        const baseState = { dirty: true, missingInfo: false };
        switch(inputType) {
            case InputKey.title:
                return this.setState({ ...baseState, [inputType]: value,  });
            case InputKey.description:
                return this.setState({ ...baseState, description: value });
            case InputKey.minBid:
                return this.setState({ ...baseState, minBid: parseInt(value, 10) });
        }
    }

    handleItemFocus = (i: number) => {
        if (this.state.dirty) {
            return this.setState({ confirmDiscard: true });
        }
        this.setState(prevState => {
            const item = prevState.items[i];
            // TODO: Clean up all repeated instances of title, minBid, description.
            // Eiter extract into a function or save focusedItem in state
            return {
                focusedIndex: i,
                title: item.title,
                minBid: getMinBidValue(item.bids),
                description: item.description,
            };
        });
    }

    handleAddItem = () => {
        const {items} = this.state;
        const newItem = createNewAuctionItem(items);
        const newItemValues = {
            title: newItem.title,
            description: newItem.description,
            minBid: getMinBidValue(newItem.bids),
        }
        const blankItemIndex = items.findIndex(item => !item.title.length);
        if (blankItemIndex > -1) {
            return this.setState({
                focusedIndex: blankItemIndex,
                ...newItemValues,
            });
        }
        const itemsWithNew = [...items, newItem];

        this.setState({
            items: itemsWithNew,
            focusedIndex: itemsWithNew.indexOf(newItem),
            ...newItemValues
        });
    }

    handleSaveChanges = (focusedItem: ItemData) => e => {
        this.props.submitChange(focusedItem);
        this.setState({ dirty: false, confirmDiscard: false });
    }

    handleDiscardChanges = e => {
        this.setState(prevState => {
            const { items, focusedIndex } = prevState
            const { title, description, bids } = items[focusedIndex];
            return {
                title,
                description,
                minBid: getMinBidValue(bids),
                dirty: false,
                confirmDiscard: false
            }
        });
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        const { items, focusedIndex, title, description, minBid } = this.state;
        if (!(title.trim() && description.trim())) {
            return this.setState({ missingInfo: true });
        }
        const item = items[focusedIndex];
        const bids = item.bids.map(bid => 
            bid.name === 'min' ? { ...bid, value: minBid } : bid);
        const newItem = { ...item, title, description, bids };
        this.props.submitChange(newItem);
        this.setState({ dirty: false, missingInfo: false });
    }

    handleDelete = (e: any) => {
        this.setState(prevState => {
            const { items, focusedIndex} = prevState;
            const focusedItem = items[focusedIndex];
            this.props.deleteRequest(focusedItem.id);
            // TODO: I shouldn't need to filter both here and in reducer?
            const filteredItems = items.filter(({id}) => id !== focusedItem.id);
            const safeItemsAfterDelete = filteredItems.length ? filteredItems : [createNewAuctionItem()];
            const safeFocusedIndex = focusedIndex >= safeItemsAfterDelete.length
                ? safeItemsAfterDelete.length - 1
                : focusedIndex;
            const safeItemAfterDelete = safeItemsAfterDelete[safeFocusedIndex];
            return {
                focusedIndex: safeFocusedIndex,
                items: safeItemsAfterDelete,
                title: safeItemAfterDelete.title,
                description: safeItemAfterDelete.description,
                minBid: getMinBidValue(safeItemAfterDelete.bids),
            }
        });
    }

    closeModal = (name: Modal) => e => {
        if (!e.key || e.key === 'Escape') {
            switch (name) {
                case Modal.missingInfo:
                    return this.setState({ missingInfo: false });
                case Modal.confirmDiscard:
                    return this.setState({ confirmDiscard: false });
            }
        }
    }

    render() {
        const {
            items,
            title,
            minBid,
            description,
            focusedIndex,
            missingInfo,
            confirmDiscard
        } = this.state;

        return (
            <div>
                {confirmDiscard &&
                    <ConfirmDiscard
                        onCloseModal={this.closeModal(Modal.confirmDiscard)}
                        onSaveChanges={this.handleSaveChanges(items[focusedIndex])}
                        onDiscardChanges={this.handleDiscardChanges}
                    />
                }
                {missingInfo &&
                    <MissingInfoNotice
                        onCloseModal={this.closeModal(Modal.missingInfo)}
                    />
                }
                <AdminHeader />
                <div className="admin-page">
                    <Sidebar
                        items={items}
                        title={title}
                        focusedIndex={focusedIndex}
                        onAddItem={this.handleAddItem}
                        onItemFocus={this.handleItemFocus}
                    />
                    <ItemEditor
                        title={title}
                        minBid={minBid}
                        description={description}
                        onSubmit={this.handleSubmit}
                        onDelete={this.handleDelete}
                        onChangeTitle={this.handleInputChange(InputKey.title)}
                        onChangeMinBid={this.handleInputChange(InputKey.minBid)}
                        onChangeDescription={this.handleInputChange(InputKey.description)}
                    />
                </div>
            </div>
        )
    }
}

const mStP = state => ({ initialItems: selectAuctionItems(state) });
const mDtP = { submitChange, deleteRequest };

export default connect(mStP, mDtP)(AdminPage);