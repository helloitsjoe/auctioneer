import * as React from 'react';
import {connect} from 'react-redux';
import {closeModal, submitChange, discardChange } from '../actions/adminActions';
import {selectConfirmDiscard, selectFocusedItem, ItemData} from '../reducers';

import ItemEditor from './ItemEditor';
import { Poller } from '../Poller';
import Sidebar from './Sidebar';
import {AdminHeader} from './AdminHeader';
import {ConfirmDiscard} from './ConfirmDiscard';

type Props = {
    poller: Poller;
    confirmDiscard: boolean;
    focusedItem: ItemData;
    closeModal: () => void;
    submitChange: (item: ItemData) => void;
    discardChange: () => void;
}

export class AdminPage extends React.Component<Props> {

    static defaultProps = {
        poller: new Poller()
    }

    // TODO: Maybe move temp item state from Redux into this component

    componentDidMount() {
        this.props.poller.stop();
    }

    handleCloseModal = (e) => {
        if (!e.key || e.key === 'Escape') {
            this.props.closeModal();
        }
    }

    render() {    
        return (
            <div>
                {this.props.confirmDiscard &&
                    <ConfirmDiscard
                        onSaveChanges={() => this.props.submitChange(this.props.focusedItem)}
                        onDiscardChanges={this.props.discardChange}
                        onCloseModal={this.handleCloseModal} />}
                <AdminHeader />
                <div className="admin-page">
                    <Sidebar />
                    <ItemEditor />
                </div>
            </div>
        )
    }
}

const mStP = state => ({
    confirmDiscard: selectConfirmDiscard(state),
    focusedItem: selectFocusedItem(state),
});

const mDtP = {
    closeModal,
    submitChange,
    discardChange,
};

export default connect(mStP, mDtP)(AdminPage);