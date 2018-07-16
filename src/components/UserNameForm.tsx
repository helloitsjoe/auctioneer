import * as React from 'react';
import { DEFAULT_NAMES, randFromArr } from '../utils';

export const UserNameForm = () => {
    
    const changeUserName = (e) => {
        e.preventDefault();
        // TODO: Don't use sessionStorage
        window.sessionStorage.userID = e.target.value;
    }

    const setUserName = (e) => {
        e.preventDefault();
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
                    defaultValue={window.sessionStorage.userID}
                    onFocus={focusUserName}
                    onChange={changeUserName} />
                {/* <input type="submit" onClick={submitName} /> */}
            </form>
        </div>
    )
}