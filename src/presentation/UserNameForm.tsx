import * as React from 'react';

export const UserNameForm = () => {

    const changeUserName = (e) => {
        e.preventDefault();
        e.target.value = e.target.value.toUpperCase();
        // TODO: Don't use sessionStorage
        sessionStorage.setItem('userName', e.target.value);
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
                    defaultValue={sessionStorage.getItem('userName')}
                    onFocus={focusUserName}
                    onChange={changeUserName} />
            </form>
        </div>
    )
}
    