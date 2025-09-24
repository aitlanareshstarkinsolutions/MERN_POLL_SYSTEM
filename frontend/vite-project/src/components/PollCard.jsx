import React from "react";
import "../pages/styles.css"
const PollCard = ({ poll, onVote, isTeacher = false }) => {
  if (!poll) return null;

  return (
    <div className="poll-card">
      <h3 className="poll-question">{poll.question}</h3>

      <ul className="poll-options">
        {poll.options.map((option, index) => (
          <li key={index} className="poll-option">
            {isTeacher ? (
              // Teacher view: show vote counts
              <div className="option-result">
                <span>{option.text}</span>
                <span className="vote-count">{option.votes} votes</span>
              </div>
            ) : (
              // Student view: allow voting
              <button
                className="vote-button"
                onClick={() => onVote && onVote(index)}
              >
                {option.text}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollCard;
