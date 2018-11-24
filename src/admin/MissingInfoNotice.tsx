import * as React from 'react';
import { Modal } from '../Modal';

type Props = {
    onCloseModal: (e: any) => void;
}

export function MissingInfoNotice({onCloseModal}: Props) {
    return (
        <Modal onCloseModal={onCloseModal}>
            <div className="missing-info">
                <p>Title and Description required</p>
            </div>
        </Modal>
    )
}