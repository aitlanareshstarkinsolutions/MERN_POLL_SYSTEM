import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import "./styles.css"
export default function PollHistory() {
  const [polls, setPolls] = useState([]);

  useEffect(()=>{
    const fetch = async () => {
      const res = await API.get('/polls');
      setPolls(res.data);
    };
    fetch();
  },[]);

  return (
    <div className="container">
      <h1 className="h1">View <strong>Poll History</strong></h1>
      <p className="sub">Past polls and results</p>

      {polls.map(p=>(
        <div key={p._id} style={{marginBottom:28}}>
          <div className="poll-wrap" style={{maxWidth:760}}>
            <div className="poll-header">{p.question}</div>
            <div className="options">
              {p.options.map((o,idx)=>(
                <div key={idx} className="option-row">
                  <div className="option-num">{idx+1}</div>
                  <div className="option-text">{o.text}</div>
                  <div className="percent-box">{Math.round((o.votes || 0) / (p.options.reduce((s,x)=>s + (x.votes ||0),0) || 1) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
          <Link to={`/results/${p._id}`} className="small-btn" style={{marginTop:8}}>View details</Link>
        </div>
      ))}
    </div>
  );
}
