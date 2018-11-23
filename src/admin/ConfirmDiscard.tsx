import * as React from 'react';

type Props = {
    onCloseModal: (e: any) => void;
    onSaveChanges: (e: any) =>  void;
    onDiscardChanges: (e: any) =>  void;
}

export class ConfirmDiscard extends React.Component<Props> {

    componentDidMount() {
        document.addEventListener('keydown', this.props.onCloseModal);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.props.onCloseModal);
    }

    render() {
        return (
            <div className="confirm-discard-background" onClick={this.props.onCloseModal}>
                <div className="confirm-discard">
                    <p>You have unsaved changes!</p>
                    <br />
                    <button
                        className="save"
                        onClick={this.props.onSaveChanges}>Save changes</button>
                    <button
                        className="delete discard"
                        onClick={this.props.onDiscardChanges}>Discard changes</button>
                </div>
            </div>
        )
    }
}