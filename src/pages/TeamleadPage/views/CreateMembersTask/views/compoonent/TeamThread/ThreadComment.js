import React, { useState } from "react";
import Avatar from "react-avatar";
import styled from "styled-components";

const ThreadComment = ({ text, handleChange, comments, commentInput, user }) => {
  const userName = user.trim();
  const initials = userName.charAt(0).toUpperCase();
  const Wrapper = styled.div`
.comment-container {
  display: flex;
  gap: 1rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.avatar-container {
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-content textarea {
  width: 100%;
  resize: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  font-family: poppins;
}

.comment-details {
  margin-top: 8px;
}

.user-name {
  font-weight: 600;
}

.comment-text {
  margin-top: 4px;
}

`
  return (
    <Wrapper>
      <div className="comment-container">
        <div className="avatar-container">
          <Avatar name={initials} size={40} round />
        </div>
        <div className="comment-content">
          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Enter your comment..."
            className={commentInput}
          />
          <div className="comment-details">
            <p className="user-name">{user}</p>
            <p className="comment-text">{comments}</p>
          </div>
        </div>
      </div>
    </Wrapper>

  );
};

export default ThreadComment;
