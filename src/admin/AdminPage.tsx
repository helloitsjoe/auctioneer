import * as React from 'react';
import {connect} from 'react-redux';
import {closeModal, submitChange, discardChange } from '../actions/adminActions';
import {selectConfirmDiscard, selectFocusedItem, selectMissingInfo, ItemData, Modal} from '../reducers';

import ItemEditor from './ItemEditor';
import { Poller } from '../Poller';
import Sidebar from './Sidebar';
import {AdminHeader} from './AdminHeader';
import { ConfirmDiscard } from './ConfirmDiscard';
import { MissingInfoNotice } from './MissingInfoNotice';

type Props = {
    poller: Poller;
    missingInfo: boolean;
    focusedItem: ItemData;
    confirmDiscard: boolean;
    closeModal: (name: Modal) => void;
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

    handleCloseModal = (name: Modal) => e => {
        if (!e.key || e.key === 'Escape') {
            this.props.closeModal(name);
        }
    }

    render() {
        const {
            missingInfo,
            focusedItem,
            submitChange,
            discardChange,
            confirmDiscard,
        } = this.props;

        return (
            <div>
                {confirmDiscard &&
                    <ConfirmDiscard
                        onCloseModal={this.handleCloseModal(Modal.confirmDiscard)}
                        onSaveChanges={() => submitChange(focusedItem)}
                        onDiscardChanges={discardChange}
                    />
                }
                {missingInfo &&
                    <MissingInfoNotice
                        onCloseModal={this.handleCloseModal(Modal.missingInfo)}
                    />
                }
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
    focusedItem: selectFocusedItem(state),
    missingInfo: selectMissingInfo(state),
    confirmDiscard: selectConfirmDiscard(state),
});

const mDtP = {
    closeModal,
    submitChange,
    discardChange,
};

export default connect(mStP, mDtP)(AdminPage);