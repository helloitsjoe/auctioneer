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

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { focusedIndex } = this.state;
        // console.log(`this.state.items.length:`, this.props.initialItems.length);
        // console.log(`this.state.title:`, this.state.title);
        // console.log(`missingInfo:`, this.state.missingInfo);
        // if (this.state.items.length !== this.props.initialItems.length) {
        //     return this.setState({ items: this.props.initialItems });
        // }
        // const itemDeleted = prevState.items.length !== this.props.initialItems.length;
        if (focusedIndex === prevState.focusedIndex) {
            return;
        }    
        this.setState(_ => {
            // const items = itemDeleted ? this.props.initialItems : prevState.items;
            const items = this.state.items;
            const item = items[focusedIndex];
            const { description, title } = item;
            const minBid = getMinBidValue(item.bids);
            return {
                items,
                description,
                minBid,
                title,
            }
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

    handleAddItem = () => {
        const {items} = this.state;
        const blankItemIndex = items.findIndex(item => !item.title.length);
        if (blankItemIndex > -1) {
            return this.setState({ focusedIndex: blankItemIndex });
        }
        const newItem = createNewAuctionItem(items);
        const itemsWithNew = [...items, newItem];

        this.setState({
            items: itemsWithNew,
            focusedIndex: itemsWithNew.indexOf(newItem)
        });
    }

    handleItemFocus = (i: number) => {
        if (this.state.dirty) {
            return this.setState({ confirmDiscard: true });
        }
        this.setState({ focusedIndex: i });
    }

    handleDiscardChanges = () => {
        
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        const { items, focusedIndex, title, description, minBid } = this.state;
        const item = items[focusedIndex];
        const bids = item.bids.map(bid => 
            bid.name === 'min' ? { ...bid, value: minBid } : bid);
        const newItem = { ...item, title, description, bids };
        if (!(item.title.trim() && item.description.trim())) {
            return this.setState({ missingInfo: true });
        }
        this.props.submitChange(newItem);
        this.setState({ dirty: false, missingInfo: false });
    }

    handleDelete = (e: any) => {
        const focusedItem = this.state.items[this.state.focusedIndex];
        this.props.deleteRequest(focusedItem.id);
        this.setState(prevState => ({ items: prevState.items.filter(({id}) => id !== focusedItem.id)}));
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
        const { submitChange } = this.props;

        const {
            items,
            title,
            minBid,
            description,
            focusedIndex,
            missingInfo,
            confirmDiscard
        } = this.state;
        const focusedItem = items[focusedIndex];

        return (
            <div>
                {confirmDiscard &&
                    <ConfirmDiscard
                        onCloseModal={this.closeModal(Modal.confirmDiscard)}
                        onSaveChanges={() => submitChange(focusedItem)}
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