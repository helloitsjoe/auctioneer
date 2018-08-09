import * as React from 'react';

export const UserNameForm = () => {
    
    const changeUserName = (e) => {
        e.preventDefault();
        e.target.value = e.target.value.toUpperCase();
        // TODO: Don't use sessionStorage
        window.sessionStorage.userName = e.target.value;
    }

    const setUserName = (e) => {
        // Don't call preventDefault so the page refreshes and bids are updated
        document.getElementById('input').blur();
    }

    const focusUserName = (e) => {
        e.target.select();
    }

    return (
        <div className="centered user-form">
            <form onSubmit={setUserName} >
                <span>Username: </span>
                <input
                    id="input"
                    type="text"
                    defaultValue={window.sessionStorage.userName}
                    onFocus={focusUserName}
                    onChange={changeUserName} />
                {/* <input type="submit" onClick={submitName} /> */}
            </form>
        </div>
    )
}