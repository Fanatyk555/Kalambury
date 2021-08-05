import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DrawPanel = (props) => {
  return(
    <>
      {props.action === "draw" ?
      <>
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
      </> :
      <>
        <h3>Panel</h3>
        <br/>
        <div className="gumka">
          <img className="disabled" src="https://image.flaticon.com/icons/png/512/1076/1076334.png" alt="Gumka" width="40" height="40"/>
        </div>
        <div className="color red disabled"></div>
        <div className="color orange disabled"></div>
        <div className="color yellow disabled"></div>
        <div className="color green disabled"></div>
        <div className="color l-blue disabled"></div>
        <div className="color blue disabled"></div>
        <div className="color purple disabled"></div>
        <div className="color white disabled"></div>
        <div className="color black disabled"></div>
      </>}
    </>
  )
}

export default DrawPanel;