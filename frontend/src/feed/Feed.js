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
  const sessionID = JSON.parse(localStorage.getItem('session'))
  const username = user?.username;
  const navigate = useNavigate();
  const [messageList, setMessageList] = useState([]);
  const [ws, setWs] = useState()
  const [messageInput, setMessageInput] = useState("");
  const [sessionList, setSessionList] = useState([])


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
        
    }, 5);
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
        else if (response.status === 401){
          Logout();
        }
        
        else {

        console.log(data);
        }
        
    } catch (error) {
        console.log(error);

    }
    };

    const getSessions = async () => {
      try {
        const response = await Fetch("get-sessions", "get");
        console.log(response);
        const data = await response.json();
        console.log(data);

        console.log(response.ok, "true?");
        console.log(response.status, "status")

        if (response.ok) {
        setSessionList(data)



        } 
        else if (response.status === 401){
          Logout();
        }
        
        else {

        console.log(data);
        }
        
    } catch (error) {
        console.log(error);

    }


    }

    const endSession = async (id) => {

      try {
        const response = await Fetch(`end-session/${id}`, "delete");
        console.log(response);
        const data = await response.json();
        console.log(data);

        console.log(response.ok, "true?");
        console.log(response.status, "status")

        if (response.ok) {

        setSessionList(sessionList.filter(item => item.session_id !== id))
        if (id === sessionID) {
          Logout();
        }



        } 
        else if (response.status === 401){ 
          Logout();
        }
        
        else {

        console.log(data);
        }
        
    } catch (error) {
        console.log(error);

    }


    }



  useConstructor(() => {
    connect();

    console.log(
      "This only happens ONCE and it happens BEFORE the initial render."
    );
  });

  useEffect(()=>{
    getMessages();
    getSessions();
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
      <div className="welc-user"><span>Welcome {user?.username}</span></div>
      <div className="log-out"><button onClick={Logout}>Logout</button></div>
          
      </div>
      <div className="main-body">
      <div className="chat-body">
        <ul id="chat-log">
          {messageList?.map((data, i) => {
            return (
              <li
                className={data.author === username ? "sent" : "replies"}
                key={i}
              >

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

        <textarea
          id="chat-message-input"
          type="text"
          size="100"
          name="text"
          className="messagebox"
          placeholder="Enter a message.."
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
          <div>
            <p>Sessions</p>
          </div>
          <ul className="sessions-ul">
            {sessionList?.map((data, i)=> {
              return (
                <li
                key={i}>
              <div className="sess-cont">
                <div>
                <span>{sessionID === data.session_id? "Current Session" : `Session ${data.session_id}`}</span>
                </div>
                <div className="sess-but">
                <button onClick={()=>{endSession(data.session_id)}}>logout</button>
                </div>
              </div>
            </li>

              )

            })}
            
          </ul>

      </div>
      </div>
     
    </>
  );
}

export default Feed;