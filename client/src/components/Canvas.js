import React, { useRef, useEffect } from 'react';
import Paper from 'paper';
import axios from 'axios';

const Canvas = (props) => {
  let refB = useRef(null)
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current;
    Paper.setup(canvas);
    let myPath, pathString, point;

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
      const data = pathString;
      axios
        .post('http://192.168.0.2:9000/testAPI', data)
        .catch(err => console.error(err));
    };
    Paper.view.draw();
    }, []);
 
  return(
    <canvas ref={canvasRef} {...props} id="canvas" resize="false" />
  )
}

export default Canvas;