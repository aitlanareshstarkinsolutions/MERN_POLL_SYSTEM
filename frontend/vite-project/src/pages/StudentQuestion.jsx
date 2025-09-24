import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import socket  from '../socket';
import ChatBox from '../components/ChatBox';
import "./styles.css"
export default function StudentQuestion({ name }) {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submited, setSubmitted] = useState(false);

  useEffect(()=>{
    const fetch = async () => {
      const res = await API.get(`/polls/${id}`);
      setPoll(res.data);
    };
    fetch();
    socket.emit('joinPoll', id);
    socket.on('pollUpdated', (p)=> setPoll(p));
    socket.on('pollClosed', (p)=> setPoll(p));
    return ()=> {
      socket.off('pollUpdated'); socket.emit('leavePoll', id);
    };
  },[id]);

  const submit = async () => {
    if(selected === null) return alert('Select option');
    socket.emit('submitAnswer', { pollId: id, optionIndex: selected });
    setSubmitted(true);
  };

  if(!poll) return <div className="center">Loading...</div>;

  return (
    <div className="container">
      <h2 className="h1">Question 1 <span style={{marginLeft:8,color:'red'}}>⏱ {poll.durationSeconds}s</span></h2>
      <div className="poll-wrap" style={{maxWidth:760}}>
        <div className="poll-header">{poll.question}</div>
        <div className="options">
          {poll.options.map((opt,idx)=>(
            <div key={idx} className="option-row" onClick={()=>setSelected(idx)} style={{cursor:'pointer',border:selected===idx ? `2px solid var(--purple)` : undefined}}>
              <div className="option-num">{idx+1}</div>
              <div className="option-text">{opt.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop:18}}>
        <button className="button" onClick={submit} disabled={submited}>{submited ? 'Submitted' : 'Submit'}</button>
      </div>

      <ChatBox pollId={id} />
    </div>
  );
}
