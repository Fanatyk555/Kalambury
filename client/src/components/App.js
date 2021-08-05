import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import Paper from 'paper';
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Header from './Header';
import MainDraw from './Main';
import Footer from './Footer';
import LoginPanel from './LoginPanel';

class App extends React.Component {
  state = {
    apiResponse: "",
    apiResponseChatMessages: [],
    apiResponseChatActiveMessages: [],
    roundNumber: "",
    activeWord: "",
    gameStartTime: "",
    drawerName: "",
    gameStarted: false,
    newRound: false,
    action: "",
    timeS: 0,
    timeM: 0,
    time: 0
  }
  componentDidMount(){
    setInterval(() => {
      this.callAPI();
      this.timer();
      this.getChatMessages();
      this.getChatActiveMessages();
      this.getRoundData();
      this.checkWhoGuess();
      this.newRound();
    }, 1000);
  }
  callAPI(){
    fetch("http://192.168.0.12:9000/testAPI")
    .then(res => res.json())
    .then(res => this.setState({
      apiResponse: [...res]
    }))
  }
  // callWord(){
  //   fetch("http://192.168.0.12:9000/word")
  //   .then(res => res.json())
  //   .then(res => this.setState({
  //     activeWord: res[0]
  //   }))
  // }
  handleActionGuess = () => {
    this.setState({
      action: "guess"
    })
  }
  handleActionDraw = () => {
    this.setState({
      action: "draw"
    })
  }
  timer = () => {
    let today = new Date();
    let sec = today.getSeconds();
    let min = today.getMinutes();
    let oldToday = this.state.gameStartTime;
    oldToday = new Date(oldToday);
    const diffTimeMinutes = Math.floor((today - oldToday)/1000/60);
    const diffTimeSeconds = Math.floor((today - oldToday)/1000);
    const diffTimeSeconds1 = Math.floor((today.getMinutes() - oldToday.getMinutes()));
    const diffTimeSeconds2 = Math.floor((today.getSeconds() - oldToday.getSeconds()));
    const diffTimeSeconds3 = Math.floor((today.getSeconds() + oldToday.getSeconds()));
    if(diffTimeSeconds2>0)console.log(diffTimeSeconds2);
    else console.log(diffTimeSeconds3);
    // console.log(diffTimeMinutes);
    // console.log(diffTimeSeconds);
    // console.log(diffTimeSeconds1);
    // console.log(diffTimeSeconds2);
    // console.log(oldToday);
    // console.log(today);
    // console.log((today-oldToday)/60000)
    this.setState({
      timeS: sec
    })
  }
  getRoundData = () => {
    fetch('http://192.168.0.12:9000/roundData')
    .then(res => res.json())
    .then(res => {
      let splitRes = res[0];
      let one = JSON.stringify(res);
      let two = JSON.stringify(this.state.apiResponseRoundData);
      if(one !== two){
        this.setState({
          roundNumber: splitRes[0],
          activeWord: splitRes[1],
          gameStartTime: splitRes[2],
          drawerName: splitRes[3]
        })
      }
      else return null
    })
  }
  getChatMessages = () => {
    fetch('http://192.168.0.12:9000/chatMessages')
    .then(res => res.json())
    .then(res => {
      let one = JSON.stringify(res);
      let two = JSON.stringify(this.state.apiResponseChatMessages);
      if(one !== two){
        this.setState({
          apiResponseChatMessages: res
        })
      }
      else return null
    })
  }
  getChatActiveMessages = () => {
    fetch('http://192.168.0.12:9000/chatActiveMessages')
    .then(res => res.json())
    .then(res => {
      let one = JSON.stringify(res);
      let two = JSON.stringify(this.state.apiResponseChatActiveMessages);
      if(one !== two){
        this.setState({
          apiResponseChatActiveMessages: res
        })
      }
      else return null
    })
  }
  checkWhoGuess = () => {
    const word = this.state.activeWord;
    const messages = this.state.apiResponseChatActiveMessages;
    let whoId, whoName;
    // console.log(this.state.apiResponseChatActiveMessages);
    // console.log(messages.indexOf(word));
    messages.map(array => {
      if(array.includes(word)===true) return(whoId = array[0], whoName = array[1]);
      else return null
    })
    if(whoId >= 0){
      this.notifyWinner(whoName);
      this.setState({newRound: true});
      // console.log("koniec rundy");
    }
    else return null;
  }
  clear = () => {
    fetch('http://192.168.0.12:9000/reset');
    fetch('http://192.168.0.12:9000/resetChat');
    if(Paper.project !== null) Paper.project.activeLayer.removeChildren();
    else if(Paper.project === null) return null;
  }
  newRound = () => {
    if(this.state.newRound === true){
      // this.callWord();
      this.clear();
      // uaktualnij ranking
      this.setState({
        newRound: false,
        timeM: 0,
        timeS: 0
      })
    }
    else return null;
  }
  notifyWinner = (winner) => toast(`${winner} odgadł hasło: "${this.state.activeWord}"`,{
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  handleStartGame = () => {
    this.setState({
      gameStarted: true,
      newRound: true
    })
  }
  render() {
    const userName = sessionStorage.getItem('userName') || "brak loginu";
    const userPassword = sessionStorage.getItem('userPassword') || "brak hasła";
    const userId = sessionStorage.getItem('userId') || "brak userId";
    const isLogged = sessionStorage.getItem('isLogged') || "brak isLogged";
    return (
      <>
        <Router>
          <Switch>
            <Route exact path="/">
              <div className="container-fluid text-white">
                <LoginPanel/>
              </div>
            </Route>
            <Route path="/draw">
              <div className="container-fluid text-white">
                {this.state.time}
                {/* <p>{userName} {userPassword} {isLogged} {userId}</p> */}
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
                <Header 
                  action={this.state.action} 
                  handleActionGuess={this.handleActionGuess} 
                  handleActionDraw={this.handleActionDraw} 
                  timerS={this.state.timeS} timerM={this.state.timeM} 
                  activeWord={this.state.activeWord}
                />
                <MainDraw 
                  canvasPath={this.state.apiResponse} 
                  action={this.state.action}
                  message={this.state.apiResponseChatMessages}
                  gameStarted={this.state.gameStarted}
                  handleStartGame={this.handleStartGame}
                />
                <Footer/>
              </div>
            </Route>
            <Route path="/guess">
              <div className="container-fluid text-white">
                <ToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable
                  pauseOnHover
                />
                <Header 
                  action={this.state.action} 
                  handleActionGuess={this.handleActionGuess} 
                  handleActionDraw={this.handleActionDraw} 
                  timerS={this.state.timeS} 
                  timerM={this.state.timeM} 
                  activeWord={this.state.activeWord}/>
                <MainDraw 
                  canvasPath={this.state.apiResponse} 
                  action={this.state.action} 
                  message={this.state.apiResponseChatMessages}/>
                <Footer/>
              </div>
            </Route>
          </Switch>
        </Router>
      </>
    )
  }
}

export default App;