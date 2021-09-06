import React, {useRef, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DrawPanel from './DrawPanel';
import Canvas from './Canvas';
import Svg from './Svg';
import Ranking from './Ranking';
import Chat from './Chat';

const Main = (props) => {
  const messagesEnd = useRef()
  function scrollToBottom(){
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(() => {
    scrollToBottom();
  }, [props.message])
  return(
    <main className="row justify-content-between">
      <div className="lewo col-sm-1 text-white">
        <DrawPanel action={props.action}/> 
      </div>
      {props.action === "draw" ? 
      // (props.gameStarted === false ?
      //   <div className="col-sm-8  row align-items-center text-dark">
      //     <div className="row justify-content-center">
      //       <button className="col-sm-3 btn-light btn-lg" onClick={props.handleStartGame}>Start Game!</button>
      //     </div>
      //   </div>:
      <Canvas path={props.canvasPath} action={props.action} className="srodek col-sm-8 text-dark"/>
      :<Svg path={props.canvasPath} className="srodek col-sm-8 text-dark"/>}
      <div className="prawo col-sm-2 text-white">
        <Ranking 
          usersList={props.usersList}
          usersRanking={props.usersRanking}
        />
        <br/>
        <Chat 
          writeHandle={props.writeHandle} 
          writedMessage={props.writedMessage} 
          message={props.message} 
          ref={messagesEnd} 
          scrollToBottom={scrollToBottom}
        />
      </div>      
    </main>
  )
}

export default Main;