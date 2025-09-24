import React, { useEffect, useState, useRef } from 'react';
import socket  from '../socket';
import "../pages/styles.css"
export default function ChatBox({ pollId }) {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const ref = useRef();

  useEffect(()=>{
    if(!pollId) return;
    socket.on('chatMessage', (m) => setMessages(prev => [...prev, m]));
    return ()=> socket.off('chatMessage');
  }, [pollId]);

  const send = () => {
    if(!text.trim()) return;
    socket.emit('chatMessage', { pollId, author: 'User', text });
    setText('');
  };

  return (
    <div style={{position:'fixed',right:24,top:120,zIndex:40}}>
      <div className="chat-box" style={{width:320}}>
        <div className="chat-head">Chat</div>
        <div className="chat-messages" ref={ref}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems: m.author === 'User' ? 'flex-end':'flex-start'}}>
              <div className={`msg ${m.author==='User'?'me':'them'}`} style={{marginBottom:6}}>{m.text}</div>
              <div style={{fontSize:12,color:'#999'}}>{m.author}</div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input className="input" style={{flex:1}} placeholder="Type..." value={text} onChange={(e)=>setText(e.target.value)} />
          <button className="small-btn" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
