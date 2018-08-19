import * as React from 'react';

// export const UserNameForm = () => {
export class UserNameForm extends React.Component<any, any> {

    changeUserName = (e) => {
        e.preventDefault();
        e.target.value = e.target.value.toUpperCase();
        // TODO: Don't use sessionStorage
        window.sessionStorage.userName = e.target.value;
    }
    
    setUserName = (e) => {
        // Don't call preventDefault so the page refreshes and bids are updated
        document.getElementById('input').blur();
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
                        id="input"
                        type="text"
                        defaultValue={window.sessionStorage.userName}
                        onFocus={this.focusUserName}
                        onChange={this.changeUserName} />
                </form>
            </div>
        )
    }
}
    