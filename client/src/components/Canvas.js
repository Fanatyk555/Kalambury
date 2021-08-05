import React, { useRef, useEffect } from 'react';
import Paper from 'paper';
import axios from 'axios';
import { useLocation} from "react-router-dom";

const Canvas = (props) => {
  let refB = useRef(null)
  const canvasRef = useRef(null)
  const userName = sessionStorage.getItem('userName') || 'unknown';
  const userId = sessionStorage.getItem('userId') || 'unknown';
  function URLcheck() {
    const location = useLocation();
    if(location.pathname === "/draw"){
      console.log("tak");
    }
  }
  // URLcheck();
  useEffect(() => {
    const canvas = canvasRef.current;
    const userName = sessionStorage.getItem('userName') || 'unknown';
    const userId = sessionStorage.getItem('userId') || 'unknown';
    Paper.setup(canvas);
    let myPath;
    let pathString;
    let point;
    console.log("test")

    const book = [userName];
    axios
      .post('http://192.168.0.12:9000/startGame', book, {timeout: 2000})
      .catch(err => {
        console.error(err);
    });
    // tutaj zrobić wpis do bazy z userName tego co rysuje
    Paper.view.onMouseDown = (event) => {
      myPath = new Paper.Path();
      myPath.strokeColor = "black";
      myPath.strokeWidth = 2;
    
      point += (event.point);
      point = point.split(" ");
			pathString = point[2] + point[4]+ ';';
    };

    Paper.view.onMouseDrag = (event) => {
      myPath.add(event.point);
      point += (event.point);
      point = point.split(" ");
			pathString += point[2] + point[4]+ ';';
    };
    
    Paper.view.onMouseUp = () => {
      refB.current = pathString;
      const book = pathString;
      axios
        .post('http://192.168.0.12:9000/testAPI', book, {timeout: 2000})
        .catch(err => {
          console.error(err);
        });
    };

    Paper.view.draw();
    }, []);
 
  return(
    <canvas ref={canvasRef} {...props} id="canvas" resize="false" />
  )
}

export default Canvas;