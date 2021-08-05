import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DrawPanel = (props) => {
  return(
    <div className={props.action === "guess" ? "disabled" : null}>
      <h3>Panel</h3>
      <br/>
      <div className="gumka">
        <img src="https://image.flaticon.com/icons/png/512/1076/1076334.png" alt="Gumka" width="40" height="40"/>
      </div>
      <div className="color red"></div>
      <div className="color orange"></div>
      <div className="color yellow"></div>
      <div className="color green"></div>
      <div className="color l-blue"></div>
      <div className="color blue"></div>
      <div className="color purple"></div>
      <div className="color white"></div>
      <div className="color black"></div>
    </div>
  )
}

export default DrawPanel;