import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import socket  from '../socket';
import "./styles.css"
export default function TeacherCreate({ name, socket: sock }) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([{text:'Option 1', isCorrect:false},{text:'Option 2', isCorrect:false}]);

  const updateOption = (i, text) => {
    const next = [...options]; next[i].text = text; setOptions(next);
  };
  const addOption = ()=> setOptions([...options, {text:`Option ${options.length+1}`, isCorrect:false}]);
  const toggleCorrect = (i) => {
    const next = options.map((o, idx)=> ({...o, isCorrect: idx===i ? !o.isCorrect : o.isCorrect}));
    setOptions(next);
  };

  const createPoll = async () => {
    if(!question) return alert('Enter question');
    if(options.length < 2) return alert('Add 2+ options');
    // create via socket
    const payload = { question, options, createdBy: name || 'Teacher', durationSeconds: duration };
    socket.emit('createPoll', payload);
    // also call API to persist quickly
    try {
      const res = await API.post('/polls', payload);
      navigate(`/teacher/view/${res.data._id}`);
    } catch (err) {
      // fallback: navigate anyway
      console.error(err);
      navigate('/');
    }
  };

  return (
    <div className="container">
      <h1 className="h1">Let's <strong>Get Started</strong></h1>
      <p className="sub">Create and manage polls, set correct option, and ask questions.</p>

      <div style={{display:'flex',gap:20,marginTop:24}}>
        <div style={{flex:1}}>
          <div style={{marginBottom:8}}>Enter your question</div>
          <textarea className="input" rows={5} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Type your question..." />
        </div>
        <div style={{width:160}}>
          <div style={{marginBottom:8}}>Duration</div>
          <select className="input" value={duration} onChange={e=>setDuration(Number(e.target.value))}>
            <option value={15}>15 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={120}>120 seconds</option>
          </select>
        </div>
      </div>

      <div style={{marginTop:18}}>
        <h3>Edit Options</h3>
        {options.map((o,i)=>(
          <div key={i} style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
            <div style={{width:40,height:40,borderRadius:20,background:'var(--purple)',color:'#fff,',display:'flex',alignItems:'center',justifyContent:'center'}}> {i+1} </div>
            <input value={o.text} onChange={e=>updateOption(i,e.target.value)} className="input" />
            <label style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="checkbox" checked={o.isCorrect} onChange={()=>toggleCorrect(i)} /> Correct
            </label>
          </div>
        ))}
        <button className="small-btn mt24" onClick={addOption}>+ Add More option</button>
      </div>

      <div style={{marginTop:28,display:'flex',gap:12}}>
        <button className="button" onClick={createPoll}>Ask Question</button>
        <button className="small-btn" onClick={()=>{window.location.href='/history'}}>View Poll history</button>
      </div>
    </div>
  );
}
