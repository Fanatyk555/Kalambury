import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import Paper from 'paper';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import LoginPanel from './LoginPanel';

class App extends React.Component {
  state = {
    apiResponse: "",
    chatMessages: [],
    chatActiveMessages: [],
    loggedUsersList: [],
    usersRanking: [],
    roundNumber: "",
    activeWord: "",
    gameStartTime: "",
    drawerName: "",
    gameStarted: false,
    newRound: false,
    action: "",
    timeS: 0,
    timeM: 0,
    redirectFromDraw: false,
    redirectFromGuess: false,
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
    fetch("http://192.168.0.3:9000/testAPI")
    .then(res => res.json())
    .then(res => this.setState({ apiResponse: res }));
    const userName = sessionStorage.getItem('userName') || "guest";
    const data = [userName];
    axios
      .post('http://192.168.0.3:9000/isLogged', data)
      .catch(err => console.error(err));
    fetch("http://192.168.0.3:9000/loggedUsersList")
    .then(res => res.json())
    .then(res => this.setState({ loggedUsersList: res }));
    fetch("http://192.168.0.3:9000/usersRanking")
    .then(res => res.json())
    .then(res => {
      if(this.state.usersRanking !== res) this.setState({ usersRanking: res })
      else return null
    });
  }
  handleActionGuess = () => {
    this.setState({ action: "guess" })
    sessionStorage.setItem("action", "guess");
  }
  handleActionDraw = () => {
    this.setState({ action: "draw" })
    sessionStorage.setItem("action", "draw");
  }
  timer = () => {
    const nowTime = new Date();
    const oldTime = new Date(this.state.gameStartTime);
    const diffTime = Math.abs((nowTime - oldTime)/1000);
    const minutes = Math.floor(diffTime / 60) % 60;
    const seconds = Math.floor(diffTime % 60);
    this.setState({
      timeM: minutes,
      timeS: seconds
    })
    const action = sessionStorage.getItem('action') || "unknown";
    this.setState({ action })
  }
  getRoundData = () => {
    fetch('http://192.168.0.3:9000/roundData')
    .then(res => res.json())
    .then(res => {
      const splitRes = res[0];
      if(this.state.apiResponseRoundData !== res){
        this.setState({
          roundNumber: splitRes[0],
          activeWord: splitRes[1],
          gameStartTime: splitRes[2],
          drawerName: splitRes[3]
        })
      }
      else return null
    });
  }
  getChatMessages = () => {
    fetch('http://192.168.0.3:9000/chatMessages')
    .then(res => res.json())
    .then(res => {
      if(this.state.chatMessages !== res) this.setState({ chatMessages: res })
      else return null
    })
  }
  getChatActiveMessages = () => {
    fetch('http://192.168.0.3:9000/chatActiveMessages')
    .then(res => res.json())
    .then(res => {
      if(this.state.chatActiveMessages !== res) this.setState({ chatActiveMessages: res })
      else return null
    })
  }
  checkWhoGuess = () => {
    const word = this.state.activeWord;
    const messages = this.state.chatActiveMessages;
    let whoId, whoName;
    messages.map(array => {
      if(array.includes(word)===true) return(whoId = array[0], whoName = array[1]);
      else return null
    })
    if(whoId >= 0){
      this.notifyWinner(whoName);
      const data = [whoName];
      if(this.state.action === "draw"){
        axios
          .post('http://192.168.0.3:9000/updateRank', data)
          .catch(err => console.error(err));
        this.setState({newRound: true, redirectFromDraw: true});
        sessionStorage.setItem("action", "guess");
      }
      else this.setState({ redirectFromDraw: false });
    }
    else return null;
  }
  clear = () => {
    fetch('http://192.168.0.3:9000/reset');
    fetch('http://192.168.0.3:9000/resetChat');
    if(Paper.project !== null) Paper.project.activeLayer.removeChildren();
    else if(Paper.project === null) return null;
  }
  newRound = () => {
    if(this.state.newRound === true){
      this.clear();
      const userName = sessionStorage.getItem('userName') || 'unknown';
      if(this.state.action === "draw"){
        const data = [userName];
        axios
          .post('http://192.168.0.3:9000/newRound', data)
          .catch(err => console.error(err));
      }
      // this.setState({ newRound: false })
      setTimeout(() => {
        this.setState({ newRound: false })
      }, 500);
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
    return (
      <>
        <Router>
          {this.state.redirectFromDraw === true ? <Redirect to="guess"/> : null}
          {this.state.redirectFromGuess === true ? <><Redirect to="draw"/><div>123</div></> : null}
          <Switch>
            <Route exact path="/">
              <div className="container-fluid text-white">
                <LoginPanel/>
              </div>
            </Route>
            <Route exact path="/draw">
              <div className="container-fluid text-white">
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
                <Main 
                  canvasPath={this.state.apiResponse}
                  usersList={this.state.loggedUsersList} 
                  usersRanking={this.state.usersRanking}
                  action={this.state.action}
                  message={this.state.chatMessages}
                  gameStarted={this.state.gameStarted}
                  handleStartGame={this.handleStartGame}
                />
                <Footer/>
              </div>
            </Route>
            <Route exact path="/guess">
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
                <Main 
                  canvasPath={this.state.apiResponse}
                  usersList={this.state.loggedUsersList} 
                  usersRanking={this.state.usersRanking}
                  action={this.state.action} 
                  message={this.state.chatMessages}/>
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