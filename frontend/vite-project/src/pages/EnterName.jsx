import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles.css"
export default function EnterName({ role, setName }) {
  const [val, setVal] = useState('');
  const navigate = useNavigate();

  const goNext = () => {
    if(!val) return alert('Enter your name');
    setName(val);
    if(role === 'teacher') navigate('/teacher/create');
    else navigate('/student/wait');
  };

  return (
    <div className="container">
      <div className="center">
        <div style={{marginTop:20,padding:8,background:"linear-gradient(90deg,var(--purple),var(--purple2))",color:'#fff',borderRadius:20,fontWeight:700,display:'inline-block'}}>Intervue Poll</div>
        <h1 className="h1">Let's <strong>Get Started</strong></h1>
        <p className="sub">If you're a student, you'll be able to submit answers and see how they compare with classmates.</p>

        <div style={{width:'60%',minWidth:320}}>
          <div style={{marginBottom:8}}>Enter your Name</div>
          <input className="input" placeholder="Your name" value={val} onChange={(e)=>setVal(e.target.value)} />
          <div className="mt24" style={{display:'flex',justifyContent:'center'}}>
            <button className="button" onClick={goNext}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}
