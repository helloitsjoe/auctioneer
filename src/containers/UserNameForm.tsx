import * as React from 'react';

export class UserNameForm extends React.Component<any, any> {

    nameInput = React.createRef<HTMLInputElement>();
    state = {
        userName: sessionStorage.getItem('userName')
    }

    changeUserName = (e) => {
        const userName = e.target.value.toUpperCase();
        this.setState({ userName });
        // TODO: Don't use sessionStorage
        sessionStorage.setItem('userName', userName);
    }
    
    setUserName = (e) => {
        e.preventDefault();
        this.nameInput.current.blur();
    }
    
    focusUserName = (e) => {
        e.target.select();
    }
    
    render() {
        return (
            <div className="centered user-form">
                <form onSubmit={this.setUserName} >
                    <span>Username: </span>
                    <input
                        type="text"
                        ref={this.nameInput}
                        value={this.state.userName}
                        onFocus={this.focusUserName}
                        onChange={this.changeUserName} />
                </form>
            </div>
        )
    }
}
    