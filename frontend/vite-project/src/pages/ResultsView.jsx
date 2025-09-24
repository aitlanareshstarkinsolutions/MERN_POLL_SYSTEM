import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useParams } from 'react-router-dom';
import "./styles.css"
export default function ResultsView() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);

  useEffect(()=>{
    const fetch = async () => {
      const res = await API.get(`/polls/${id}`);
      setPoll(res.data);
    };
    fetch();
  },[id]);

  if(!poll) return <div className="center">Loading...</div>;
  const total = poll.options.reduce((s,o)=> s + (o.votes||0),0) || 1;

  return (
    <div className="container">
      <h2 className="h1">Results</h2>
      <div className="poll-wrap" style={{maxWidth:760}}>
        <div className="poll-header">{poll.question}</div>
        <div className="options">
          {poll.options.map((opt,idx)=>{
            const pct = Math.round(((opt.votes||0)/total)*100);
            return (
              <div key={idx} className="option-row">
                <div className="option-num">{idx+1}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>{opt.text}</div>
                    <div>{pct}%</div>
                  </div>
                  <div style={{height:12,background:'#eee',borderRadius:8,marginTop:8}}>
                    <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,var(--purple),var(--purple2))'}} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
