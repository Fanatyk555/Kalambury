import React from 'react';

const Svg = (props) => {
  let path = props.path;
  let pathArray = [];
  for (let i = 0; i < path.length; i++) {
    const str = JSON.stringify(path[i]);
    const subEnd = str.length - 14;
    const subStart = 4;
    let sub = str.substr(subStart, subEnd);
    sub = "M " + sub;
    const spl = sub.split(';');
    let pathValue = spl.map((item)=>item + ' L ');
    pathValue = JSON.stringify(pathValue);
    pathValue = pathValue.replace('["', "");
    for (let i = 0; i < pathValue.length-1; i++) pathValue = pathValue.replace('","', "");
    pathValue = pathValue.replace(' L "]', "");
    pathArray = pathArray.concat(pathValue);
  }
  const pathMap = pathArray.map((item,index)=>(<path key={index} d={pathArray[index]}/>)) 
  return(
    <svg className="srodek col-sm-8 text-dark">
      {pathMap}
    </svg>
  )
}

export default Svg;