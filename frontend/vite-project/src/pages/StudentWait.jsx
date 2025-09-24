import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import socket  from '../socket';
import "./styles.css"
export default function StudentWait({ name }) {
  const [live, setLive] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetch = async () => {
      const res = await API.get('/polls');
      const active = res.data.find(p => p.active);
      setLive(active || null);
    };
    fetch();

    socket.on('pollCreated', (p)=> setLive(p));
    socket.on('pollUpdated', (p)=> setLive(p));
    socket.on('pollClosed', (p)=> setLive(null));
    return ()=> socket.off('pollCreated');
  },[]);

  useEffect(()=> {
    if(live) navigate(`/student/question/${live._id}`);
  },[live]);

  return (
    <div className="center">
      <div style={{marginTop:80}}>
        <div style={{padding:8,background:"linear-gradient(90deg,var(--purple),var(--purple2))",color:'#fff',borderRadius:20,fontWeight:700,display:'inline-block'}}>Intervue Poll</div>
      </div>
      <h1 className="h1">Wait for the teacher to ask questions..</h1>
    </div>
  );
}
