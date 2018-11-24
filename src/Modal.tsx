import * as React from 'react';

type Props = {
    onCloseModal: (e: any) => void;
}

export class Modal extends React.Component<Props> {

    componentDidMount() {
        document.addEventListener('keydown', this.props.onCloseModal);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.props.onCloseModal);
    }

    render() {
        return (
            <div className="modal-background" onClick={this.props.onCloseModal}>
                <div className="modal">
                    {this.props.children}
                </div>
            </div>
        )
    }
}