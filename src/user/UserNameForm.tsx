import * as React from 'react';
import { getUser } from '../utils';

type Props = {
  initialUserName?: string;
};

type State = {
  userName: string;
};

export class UserNameForm extends React.Component<Props, State> {
  nameInput = React.createRef<HTMLInputElement>();

  static defaultProps = {
    initialUserName: getUser(),
  };

  state = {
    userName: (this.props.initialUserName || getUser()).toUpperCase(),
  };

  changeUserName = e => {
    const userName = e.target.value.toUpperCase();
    this.setState({ userName });
    sessionStorage.setItem('userName', userName);
  };

  setUserName = e => {
    e.preventDefault();
    this.nameInput.current.blur();
  };

  focusUserName = e => {
    e.target.select();
    this.nameInput.current.focus();
  };

  render() {
    return (
      <div className="centered user-form">
        <form onSubmit={this.setUserName}>
          <span>Username: </span>
          <input
            type="text"
            ref={this.nameInput}
            value={this.state.userName}
            onFocus={this.focusUserName}
            onChange={this.changeUserName}
          />
        </form>
      </div>
    );
  }
}
