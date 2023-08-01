import React, { useState } from "react";
import Avatar from "react-avatar";
import styled from "styled-components";
import { candidateCreateComment } from "../../../../../../../services/teamleadServices";


const Wrapper = styled.div`
.comment-container {
  display: flex;
  gap: 1rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  justify-content: center;
    align-items: center;
}

.text-area{
  display: flex;
  margin: 0.5rem;

  button{
    padding: 0px 1rem;
    margin-left: 0.5rem;
    font-size: 1rem;
    font-weight: 800;
    background: #005734;
    color: white;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    border: 1px solid white;

  }

  button:hover{
    background: white;
    color: #005734;
    border: 1px solid #005734;
  }
}



.avatar-container {
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

textarea {
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

const ThreadComment = ({ comments, commentInput, user, threadId }) => {
  const userName = user.trim();
  const initials = userName.charAt(0).toUpperCase();
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  //Handle Comment
  const handleComment = async () => {
    try {
      const commentData = {
        created_by: user,
        comment: text,
        thread_id: threadId
      };
      const response = await candidateCreateComment(commentData);

      console.log('Comment created successfully:', response.data);
      setText('')
      // Do something with the responseData if needed.
    } catch (error) {
      console.error('Failed to create comment:', error.message);
      // Handle the error or display an error message to the user.
    }

  };


  return (
    <Wrapper>
      <div className="text-area">
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Enter your comment..."
          className={commentInput}
        />
        {text.length > 0 && (
          <button onClick={handleComment}>Post</button>
        )}
      </div>


      <div className="comment-container">
        <div className="avatar-container">
          <Avatar name={initials} size={40} round />
        </div>
        <div className="comment-content">
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
