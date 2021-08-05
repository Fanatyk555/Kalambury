import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import Paper from 'paper';
const Header = (props) => {
  function drawReset(){
    fetch('http://192.168.0.2:9000/reset');
    Paper.project.activeLayer.removeChildren();
  }
  const str = props.activeWord;
  const strArray = str.split("");
  const strMap = strArray.map((char)=>char.replace(char,'_'));

  return(
    <header className="row align-content-center">
      <div className="col-sm-5">
        {props.action === "draw" ?
        <>
          <Link to="/guess" onClick={props.handleActionGuess}>
            <button className="btn-light btn-sm">To guess</button>
          </Link>
          <button onClick={drawReset} className="btn-light btn-sm">Reset</button>
        </>:
        <Link to="/draw" onClick={props.handleActionDraw}>
          <button className="btn-light btn-sm">To draw</button>
        </Link>}
      </div>
      <h3 className="col-sm-3">
        {props.action === "draw" ? <p>Hasło: {props.activeWord}</p> : <p>Hasło: <span>{strMap}</span></p>}
        {/* <span> _ _ _ _ _ &nbsp; _ _ _</span> */}
      </h3>
      <div className="col-sm-2"></div>
      <h3 className="col-sm-2">Czas: {props.timerM}:{props.timerS}</h3>
    </header>
  )
}

export default Header;