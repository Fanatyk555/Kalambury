import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';

class LoginPanel extends React.Component{
  state = {
    userLogin: "",
    userPassword: "",
    userEMail: "",
    apiResponseUserId: "",
    isLogged: false
  }
  handleKeyPressLogin = (e) => {
    if (e.key === 'Enter') {
      this.handleAccountLogin();
    }
  }
  handleKeyPressSignup = (e) => {
    if (e.key === 'Enter') {
      this.handleAccountSignup();
    }
  }
  handleLoginInput = (e) => {
    this.setState({
      userLogin: e.target.value
    })
  }
  handlePasswordInput = (e) => {
    this.setState({
      userPassword: e.target.value
    })
  }
  handleEMailInput = (e) => {
    this.setState({
      userEMail: e.target.value
    })
  }
  notifyWrong = (x) => toast(x, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  handleAccountLogin = () => {
    let login = "Niepoprawny login lub hasło";
    const user = [this.state.userLogin, this.state.userPassword];
    axios
      .post('http://192.168.0.12:9000/login', user)
      .catch(err => {
        console.error(err);
      });
    setTimeout(() => {
      fetch('http://192.168.0.12:9000/login')
      .then(res => res.json())
      .then(res => this.setState({
        apiResponseUserId: res
      }))
    }, 300);
    setTimeout(() => {
      if(this.state.apiResponseUserId.length !== 0){
        // const userId = JSON.stringify(this.state.apiResponseUserId[0]);
        const userId = this.state.apiResponseUserId.map(user => user.id)
        sessionStorage.setItem("userName", this.state.userLogin);
        sessionStorage.setItem("userPassword", this.state.userPassword);
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("isLogged", true);
        this.setState({isLogged: true});
      } 
      else this.notifyWrong(login);
    }, 500);
  }
  handleAccountSignup = () => {
    let signup = "Zarejestrowano pomyślnie!";
    const user = [this.state.userLogin, this.state.userPassword, this.state.userEMail];
    axios
      .post('http://192.168.0.12:9000/signup', user)
      .catch(err => {
        console.error(err);
      });
    this.notifyWrong(signup);
  }
  render(){
    return(
      <div className="row min-vh-100 align-items-center">
        <div className="row justify-content-center">
          <ToastContainer position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
          />
          <div className="login col-sm-3">
            <label>
              <small>Username: </small>
              <input 
                size="10" 
                value={this.state.userLogin} 
                onChange={this.handleLoginInput} 
                onKeyPress={this.handleKeyPressLogin}
              />
            </label>
            <br/>
            <label>
              <small>Password: </small>
              <input 
                size="10" 
                value={this.state.userPassword} 
                onChange={this.handlePasswordInput} 
                onKeyPress={this.handleKeyPressLogin}
              />
            </label>
            <br/>
            <button onClick={this.handleAccountLogin}>Zaloguj się</button>
          </div>
          {this.state.isLogged === true ? <Redirect to='/guess'/> : null}
          <div className="signup col-sm-3">
            <label>
              <small>Username: </small>
              <input 
                size="10" 
                value={this.state.userLogin} 
                onChange={this.handleLoginInput} 
                onKeyPress={this.handleKeyPressSignup}
              />
            </label>
            <br/>
            <label>
              <small>Password: </small>
              <input 
                size="10" 
                value={this.state.userPassword} 
                onChange={this.handlePasswordInput} 
                onKeyPress={this.handleKeyPressSignup}
              />
            </label>
            <br/>
            <label>
              <small>E-mail: </small>
              <input 
                size="10" 
                value={this.state.userEMail} 
                onChange={this.handleEMailInput} 
                onKeyPress={this.handleKeyPressSignup}
              />
            </label>
            <br/>
            <button onClick={this.handleAccountSignup}>Zarejestruj się</button>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginPanel;