import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router";
import Fetch from "../utils/fetch";
import { BACKENDURL } from "../config";

// import reconnectingWebsocket from "./Chat/reconnecting-websocket";

const useConstructor = (callBack = () => {}) => {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);
  if (hasBeenCalled) return;
  callBack();
  setHasBeenCalled(true);
};

function Feed(props) {
  const user = JSON.parse(localStorage.getItem('userDetails'))
  const token = JSON.parse(localStorage.getItem('token'))
  const username = user?.username;
  const navigate = useNavigate();
  const [messageList, setMessageList] = useState([]);
  const [ws, setWs] = useState()
  const [messageInput, setMessageInput] = useState("");


  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",

    });
  };

  function connect() {
    const ws1 = new WebSocket("wss://"+BACKENDURL+"/ws/feed?token="+ token);
    ws1.onopen= ()=> {
      console.log("websocket connected")
    }
    ws1.onerror = (e) =>{
      Logout();
    }
    
      
      setWs(ws1)
  }

  function initialiseChat(event) {
      getMessages();
      connect()
  }

//   ws.onmessage= function(event) {
//       console.log(event.data)
//   }

// function getMessage () {
//     ws.onmessage = (e) => {
//         console.log(e.data);
//         const message_data = JSON.parse(e.data);
//         return message_data
//       };

      
// }
useEffect(() => {
    setInterval(function () {
        ws.onmessage = async (e) =>{
            const mess = await JSON.parse(e.data)
            setMessageList((oldArray) => [...oldArray, mess]);
            console.log(mess)
        }
        ws.onclose = () => {
            console.log("WebSocket closed let's reopen");
            connect();
        }
        if (ws.CLOSE){
          connect();
        }
        
    }, 10);
  }, []);
  

  const  getMessages = async (e) => {
    

    try {
        const response = await Fetch("get-messages", "get");
        console.log(response);
        const data = await response.json();
        console.log(data);

        console.log(response.ok, "true?");
        console.log(response.status, "status")

        if (response.ok) {
        setMessageList(data)



        } 
        else if (response.status == 401){
          Logout();
        }
        
        else {

        console.log(data);
        }
        
    } catch (error) {
        console.log(error);

    }
    };

  useConstructor(() => {
    connect();

    console.log(
      "This only happens ONCE and it happens BEFORE the initial render."
    );
  });

  useEffect(()=>{
    getMessages()
    console.log("this should happen once")
  }, []);



  useEffect(() => {
    scrollToBottom();
  }, [messageList]);


 

  const messageSubmit = function (e) {
    e.preventDefault();
    const messageInputDom = document.querySelector("#chat-message-input");
    const message = messageInput;
      if (ws.OPEN) {
        ws.send(JSON.stringify({
        command: "new_message",
        message: message,
        

        }));
        messageInputDom.value = "";}
        
        

    


  };




  function Logout(){
      localStorage.clear()
      navigate('/signin');
  }

  return (
    <>
    <div className="top-bar">
          <button onClick={Logout}>Logout</button>
      </div>
      <div className="main-body">
      <div>
        <ul id="chat-log">
          {messageList?.map((data, i) => {
            return (
              <li
                className={data.author === username ? "sent" : "replies"}
                key={i}
              >
                <img src="" alt="" />
                <div className="authordiv">
                <span className="author">{data.author}</span>
                </div>

                <div className="messagediv">
                <p className="mainmessage">
                  {data.message}
                  </p>
                  </div>
                  <div className="timediv">
                  <span id="spa" className="timestamp">
                  
                    
                    {data.timestamp}
                  </span>
                  </div>
                
              </li>
            );
          })}
        </ul>
        <br />
        <div className="sendbox">

        <input
          id="chat-message-input"
          type="text"
          size="100"
          name="text"
          className="messagebox"
          onChange={(e) => setMessageInput(e.target.value)}
        />
 

   
        <input
          id="chat-message-submit"
          type="button"
          value="Send"
          onClick={messageSubmit}
          className="send-button"
        />
 
        </div>
      </div>

      <div className="sessions">


      </div>
      </div>
    </>
  );
}

export default Feed;