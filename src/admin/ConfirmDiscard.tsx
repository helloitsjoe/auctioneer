import * as React from 'react';
import { Modal } from '../Modal';

type Props = {
    onCloseModal: (e: any) => void;
    onSaveChanges: (e: any) =>  void;
    onDiscardChanges: (e: any) =>  void;
}

export function ConfirmDiscard({onSaveChanges, onDiscardChanges, onCloseModal}: Props) {
    return (
        <Modal onCloseModal={onCloseModal}>
            <div className="confirm-discard">
                <p>You have unsaved changes!</p>
                <br />
                <button
                    className="save"
                    onClick={onSaveChanges}>Save changes</button>
                <button
                    className="delete discard"
                    onClick={onDiscardChanges}>Discard changes</button>
            </div>
        </Modal>
    )
}