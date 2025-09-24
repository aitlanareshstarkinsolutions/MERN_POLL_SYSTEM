import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles.css"
export default function RoleSelect({ setRole }) {
  const navigate = useNavigate();

  const choose = (r) => {
    setRole(r);
    navigate('/enter-name');
  };

  return (
    <div className="container">
      <div className="center">
        <div style={{marginTop:20,padding:8,background:"linear-gradient(90deg,var(--purple),var(--purple2))",color:'#fff',borderRadius:20,fontWeight:700,display:'inline-block'}}>Intervue Poll</div>
        <h1 className="h1">Welcome to the <span style={{fontWeight:800}}>Live Polling System</span></h1>
        <p className="sub">Please select the role that best describes you to begin using the live polling system</p>

        <div className="role-row" style={{width:'100%'}}>
          <div className="role-card selected" onClick={()=>choose('student')}>
            <h3>I'm a Student</h3>
            <p className="sub">Submit answers and participate in live polls</p>
          </div>
          <div className="role-card" onClick={()=>choose('teacher')}>
            <h3>I'm a Teacher</h3>
            <p className="sub">Create polls and view real-time results</p>
          </div>
        </div>

        <button className="button" onClick={()=>choose('student')} style={{marginTop:28}}>Continue</button>
      </div>
    </div>
  );
}
