import * as React from 'react';
import {connect} from 'react-redux';
import {submitChange, deleteRequest } from '../actions/adminActions';
import {AuctionItem, Modal, selectAuctionItems} from '../reducers';

import { ItemEditor, InputKey } from './ItemEditor';
import { Poller } from '../Poller';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { ConfirmDiscard } from './ConfirmDiscard';
import { MissingInfoNotice } from './MissingInfoNotice';
import { createNewAuctionItem } from '../utils';

type StoreProps = {
    initialItems: AuctionItem[];
}

type DispatchProps = {
    submitChange: (item: AuctionItem) => void;
    deleteRequest: (id: number) => void;
}

type Props = StoreProps & DispatchProps & {
    poller: Poller;
    initialItems: AuctionItem[];
}

type State = {
    items: AuctionItem[];
    currentItem: AuctionItem;
    dirty: boolean;
    focusedIndex: number;
    missingInfo: boolean;
    confirmDiscard: boolean;
}

export class AdminPage extends React.Component<Props, State> {

    static defaultProps = {
        poller: new Poller()
    }

    state = {
        items: this.props.initialItems,
        dirty: false,
        focusedIndex: 0,
        currentItem: this.props.initialItems[0],
        missingInfo: false,
        confirmDiscard: false,
    }

    componentDidMount() {
        this.props.poller.stop();
    }

    handleInputChange = (inputType: InputKey) => e => {
        const { value } = e.target;
        this.setState(prevState => {
            const { currentItem } = prevState;
            const bids = currentItem.bids.map(bid =>
                bid.name === 'min' ? { ...bid, value: parseInt(value) } : bid)
            const inputMap = {
                title: { title: value },
                description: { description: value },
                minBid: { bids }
            }
            const newItem = { ...currentItem, ...inputMap[inputType] };
            return { dirty: true, missingInfo: false, currentItem: newItem }
        });
    }

    handleItemFocus = (i: number) => {
        if (this.state.dirty) {
            return this.setState({ confirmDiscard: true });
        }
        this.setState(prevState => {
            return {
                focusedIndex: i,
                currentItem: prevState.items[i],
            };
        });
    }

    handleAddItem = () => {
        this.setState(prevState => {
            const { items } = prevState;
            const blankItemIndex = items.findIndex(item => !item.title.length);
            if (blankItemIndex > -1) {
                return {
                    items,
                    focusedIndex: blankItemIndex,
                    currentItem: items[blankItemIndex],
                }
            }
            const newItem = createNewAuctionItem(items);
            const itemsWithNew = [...items, newItem];
            return {
                items: itemsWithNew,
                currentItem: newItem,
                focusedIndex: itemsWithNew.indexOf(newItem)
            };
        });
    }

    handleSaveChanges = (focusedItem: AuctionItem) => e => {
        this.props.submitChange(focusedItem);
        this.setState({ dirty: false, confirmDiscard: false });
    }

    handleDiscardChanges = e => {
        this.setState(prevState => ({
            currentItem: prevState.items[prevState.focusedIndex],
            dirty: false,
            confirmDiscard: false
        }));
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        const { currentItem } = this.state;
        if (!(currentItem.title.trim() && currentItem.description.trim())) {
            return this.setState({ missingInfo: true });
        }
        this.props.submitChange(currentItem);
        this.setState({ dirty: false, missingInfo: false });
    }

    handleDelete = (e: any) => {
        this.setState(prevState => {
            const { items, focusedIndex} = prevState;
            const focusedItem = items[focusedIndex];
            this.props.deleteRequest(focusedItem.id);
            // TODO: Don't filter both here and in reducer
            const filteredItems = items.filter(({id}) => id !== focusedItem.id);
            const safeItemsAfterDelete = filteredItems.length ? filteredItems : [createNewAuctionItem()];
            const safeFocusedIndex = focusedIndex >= safeItemsAfterDelete.length
                ? safeItemsAfterDelete.length - 1
                : focusedIndex;
            const safeItemAfterDelete = safeItemsAfterDelete[safeFocusedIndex];
            return {
                focusedIndex: safeFocusedIndex,
                items: safeItemsAfterDelete,
                currentItem: safeItemAfterDelete,
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
            currentItem,
            focusedIndex,
            missingInfo,
            confirmDiscard
        } = this.state;

        return (
            <div>
                {confirmDiscard &&
                    <ConfirmDiscard
                        onCloseModal={this.closeModal(Modal.confirmDiscard)}
                        onSaveChanges={this.handleSaveChanges(currentItem)}
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
                        focusedItem={currentItem}
                        focusedIndex={focusedIndex}
                        onAddItem={this.handleAddItem}
                        onItemFocus={this.handleItemFocus}
                    />
                    <ItemEditor
                        item={currentItem}
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

const mStP = (state): StoreProps => ({ initialItems: selectAuctionItems(state) });
const mDtP: DispatchProps = { submitChange, deleteRequest };

export default connect(mStP, mDtP)(AdminPage);