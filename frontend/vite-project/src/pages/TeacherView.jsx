import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import socket  from '../socket';
import ChatBox from '../components/ChatBox';
import PollCard from '../components/PollCard';
import "./styles.css"
export default function TeacherView() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);

  useEffect(()=>{
    const fetch = async () => {
      const res = await API.get(`/polls/${id}`);
      setPoll(res.data);
    };
    fetch();
    socket.emit('joinPoll', id);
    socket.on('pollUpdated', (p)=> setPoll(p));
    socket.on('pollClosed', (p)=> { if(p._id===id) setPoll(p);});
    return ()=> {
      socket.off('pollUpdated'); socket.off('pollClosed');
      socket.emit('leavePoll', id);
    };
  },[id]);

  const closePoll = async () => {
    socket.emit('closePoll', id);
    await API.post(`/polls/${id}/close`);
  };

  if(!poll) return <div className="center"><h3>Loading poll...</h3></div>;

  const totalVotes = poll.options.reduce((s,o)=> s+o.votes, 0) || 1;

  return (
    <div className="container">
      <h2 className="h1">Question</h2>
      <div className="poll-wrap" style={{maxWidth:760}}>
        <div className="poll-header"> {poll.question} </div>
        <div className="options">
          {poll.options.map((opt,idx)=> {
            const pct = Math.round((opt.votes/totalVotes)*100);
            return (
              <div key={idx} className="option-row">
                <div className="option-num">{idx+1}</div>
                <div className="option-text">{opt.text}</div>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div className="percent-box">{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt24" style={{display:'flex',gap:12}}>
        <button className="button" onClick={closePoll}>Close Poll</button>
      </div>

      <ChatBox pollId={id} />
      <PollCard poll={poll}  />
    </div>
  );
}
