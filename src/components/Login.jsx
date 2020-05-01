import React from 'react';
import fb from '../config/firebase';

export default class Login extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: '',
      currentView: 'Login',
      error: false,
      errorReason: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.showErrorMessage = this.showErrorMessage.bind(this);
  }

  showErrorMessage(err) {
    switch(err.code) {

      case 'auth/invalid-email':
        this.setState({ errorReason: 'Your email is incorrect' });
        break;

      case 'auth/wrong-password':
        this.setState({ errorReason: 'Your password is incorrect' });
        break;

      case 'auth/weak-password':
        this.setState({ errorReason: 'Your password should be at least 6 characters' });
        break;

      case 'auth/too-many-requests':
        this.setState({ errorReason: 'Too many incorrect attempts have been made to access this account' });
        break;

      case 'auth/network-request-failed':
        this.setState({ errorReason: 'Request could not be made, check your internet connection' })
        break;

      case 'auth/user-disabled':
        this.setState({ errorReason: 'Unfortunately your account has been disabled.'});
        break;

      default:
        this.setState({ errorReason: 'An error occurred, please try again' });
        break;
    }

    this.setState({ error: true });
  }

  login() {
    if(this.state.currentView === 'Login') {
      fb.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        console.log('successful login');
      }).catch((err) => {
        this.showErrorMessage(err);
      })
    } else {
      fb.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        this.props.isNewUser(true);
      }).catch((err) => {
        this.showErrorMessage(err);
      });
    }

  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return(
      <>
        <div className='login-container'>
          <div className='title-block'>
            <h1> Interrogation </h1>
            <div className='navBar'>
              <button className={this.state.currentView === 'Login' ? 'selected' : null} onClick={()=> this.setState({ currentView: 'Login' })}>Login</button>
              <button className={this.state.currentView === 'Sign up' ? 'selected' : null} onClick={()=> this.setState({ currentView: 'Sign up' })}>Sign up</button>
            </div>
          </div>
          <form>
            <input
              placeholder='Email Address'
              value={this.state.email}
              onChange={this.handleChange}
              name='email'
            /><br />
            <input
              placeholder='Password'
              type='password'
              value={this.state.password}
              onChange={this.handleChange}
              name='password'
            /><br />
            <button type='button' onClick={()=> this.login()}>{this.state.currentView}</button>
            {this.state.currentView === 'Sign up' &&
              <p id='information'> Sign up to save your scores and compare them to other players! </p>
            }

            {this.state.error &&
              <p id='error'> Error: {this.state.errorReason} </p>
            }
          </form>
        </div>
      </>
    )
  }
}
