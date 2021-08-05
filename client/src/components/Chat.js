import React, {forwardRef, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Chat = forwardRef((props, messagesEnd) => {
  const [writedMessage, setWritedMessage] = useState("")
  const userName = sessionStorage.getItem('userName') || 'unknown';
  const userId = sessionStorage.getItem('userId') || 'unknown';

  const handleWriteMessage = (e) => {
    setWritedMessage(e.target.value)
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
    else return null;
  }
  function handleSendMessage(){
    const data = [userId, userName, writedMessage]
    axios
      .post('http://192.168.0.2:9000/newMessage', data)
      .catch(err => console.error(err));
    setWritedMessage("");
  }
  const messageList = props.message.map((message, index)=>
    <div key={index} className="chatMessage">
      <span>{message[0]}</span>
      <p>{message[1]}</p> 
    </div>
  )
  return(
    <div className="chat text-dark">
      <div className="text">
        {messageList}
        <div ref={messagesEnd} />
      </div>
      <div className="send">
        <div className="input-group mb-3">
          <input 
            type="text" 
            className="form-control" 
            id="message" 
            name="message" 
            min="1" 
            max="100" 
            onChange={handleWriteMessage} 
            onKeyPress={handleKeyPress} 
            value={writedMessage}
          />
          <div className="input-group-append">
            <button type="submit" className="btn btn-secondary" onClick={handleSendMessage}>Wyślij</button>
          </div>
        </div>
      </div>
    </div>
  )
})
export default Chat;