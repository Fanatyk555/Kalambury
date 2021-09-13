import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paper from 'paper';
const Header = (props) => {
  function drawReset(){
    fetch('http://192.168.0.3:9000/reset');
    Paper.project.activeLayer.removeChildren();
  }
  const str = props.activeWord;
  const strArray = str.split("");
  const strMap = strArray.map((char)=>char.replace(char,'_'));

  return(
    <header className="row align-content-center">
      <div className="col-sm-5">
        {props.action === "draw"?
        <>
          <button className="btn-light btn-sm" onClick={()=>sessionStorage.setItem("action", "guess")}>To guess</button>
          <button onClick={drawReset} className="btn-light btn-sm">Reset</button>
        </>:
          <button className="btn-light btn-sm" onClick={()=>sessionStorage.setItem("action", "draw")}>To draw</button>}
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