import React, { useState } from "react";
import Avatar from "react-avatar";
import styled from "styled-components";
import { fetchThread, postComment } from "../../../../../../../services/teamleadServices";
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import LoadingSpinner from "../../../../../../../components/LoadingSpinner/LoadingSpinner";
import LittleLoading from "../../../../../../CandidatePage/views/ResearchAssociatePage/littleLoading";


const Wrapper = styled.div`
.comment-container {
  display: flex;
  gap: 1rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  justify-content: center;
    align-items: center;
    width: 100%;
  margin-bottom: 10px;
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

  input{
    border: none;
  }
}

.user-name {
  font-weight: 600;
}

.comment-text {
  margin-top: 4px;
  width: 100%;
}

`

const ThreadComment = ({ comments, commentInput, user, threadId }) => {
  const userName = user.trim();
  const initials = userName.charAt(0).toUpperCase();
  const [text, setText] = useState("");
  const { currentUser } = useCurrentUserContext();
  const [loadingcmnt, setLoadingcmnt] = useState(false);

  console.log(currentUser.portfolio_info[0].username);
  const handleChange = (e) => {
    setText(e.target.value);
  };
  //Handle Comment
  const handleComment = async () => {
    setLoadingcmnt(true)
    try {
      const commentData = {
        created_by: user,
        comment: text,
        thread_id: threadId
      };
      const response = await postComment(commentData);
      console.log('Comment created successfully:', response.data);
      setText('')
      setLoadingcmnt(false)
    } catch (error) {
      console.error('Failed to create comment:', error.message);
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
          loadingcmnt ? <LittleLoading /> :
            <button onClick={handleComment}>Post</button>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", widows: "100%" }}>
        {
          comments.map((comment) => {
            return <div className="comment-container">
              <div className="avatar-container">
                <Avatar name={initials} size={40} round />
              </div>
              <div className="comment-content">
                <div className="comment-details">
                  <p className="user-name">{comment.created_by}</p>
                  <input className="comment-text" value={comment.comment} />
                </div>
                <div className="button">
                  {currentUser.portfolio_info[0].username == comment.created_by && <button style={{ padding: "2px 10px", cursor: "pointer" }}>Edit</button>}
                </div>
              </div>
            </div>
          })
        }
      </div>

    </Wrapper>

  );
};

export default ThreadComment;
