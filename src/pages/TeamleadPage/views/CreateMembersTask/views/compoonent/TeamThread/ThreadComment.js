import React, { useEffect, useReducer, useState } from "react";
import Avatar from "react-avatar";
import styled from "styled-components";
import { fetchThread, postComment, updateSingleComment } from "../../../../../../../services/teamleadServices";
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
  align-items: center;

  .button-comment{
    padding: 0px 1rem;
    margin-left: 0.5rem;
    font-size: 0.9rem;
    background: #005734;
    font-weight: 400;
    height: 2.5rem;
    color: white;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    border: 1px solid white;

  }

  .button-comment:hover{
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
  padding: 6px 0;
}

`

const ThreadComment = ({ comments, commentInput, user, threadId, loading }) => {
  const userName = user.trim();
  const initials = userName.charAt(0).toUpperCase();
  const [text, setText] = useState("");
  const { currentUser } = useCurrentUserContext();
  const [loadingcmnt, setLoadingcmnt] = useState(false);
  const [updateComment, setUpdateComment] = useState([]);
  const [editIndex, setEditIndex] = useState();
  const [updateCommentInput, setUpdateCommentInput] = useState("")

  console.log(currentUser.portfolio_info[0].username);
  const handleChange = (e) => {
    setText(e.target.value);
  };
  useEffect(() => {
    setUpdateComment([...comments].reverse());
  }, []);


  console.log({ "updatecomment": updateComment });
  //Handle Comment
  const handleComment = async () => {
    setLoadingcmnt(true);
    try {
      const commentData = {
        created_by: user,
        comment: text,
        thread_id: threadId,
      };
      const response = await postComment(commentData);
      console.log(response);
      // Update the state with the new comment
      if (response.status == 201) {
        setUpdateComment((prevComments) => [...prevComments].reverse(), commentData);
        setText("")
      }
      // Clear the input field and reset loading
      setText('');
      setLoadingcmnt(false);
    } catch (error) {
      console.error('Failed to create comment:', error.message);
    }
  };


  const handleUpdate = (comment) => {
    const document_id = comment._id;
    const created_by = comment.created_by;
    updateSingleComment({
      comment: updateCommentInput,
      document_id: document_id,
      created_by: created_by
    }).then(resp => console.log(resp))
    setEditIndex(null)
  }


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
            <button className="button-comment" onClick={handleComment}>Post</button>
        )}

        {
          loading && <LittleLoading />
        }

      </div>

      <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
        {updateComment.reverse().map((comment, index) => {
          return (
            <div className="comment-container" key={comment._id}>
              <div className="avatar-container">
                <Avatar name={initials} size={40} round />
              </div>
              <div className="comment-content">
                <div className="comment-details">
                  <p className="user-name">{comment.created_by}</p>
                  {editIndex === index ? (
                    <input
                      className="comment-text"
                      style={{ paddingLeft: "5px", border: "1px solid black" }}
                      defaultValue={comment.comment}
                      onChange={(e) => setUpdateCommentInput(e.target.value)}
                    />
                  ) : (
                    <input className="comment-text" defaultValue={comment.comment} disabled />
                  )}
                </div>
                {editIndex === index ? (
                  <>
                    <div className="button">
                      {currentUser.portfolio_info[0].username === comment.created_by && (
                        <button
                          style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#005734", border: "none", color: "white" }}
                          onClick={() => handleUpdate(comment)}
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="button">
                      {currentUser.portfolio_info[0].username === comment.created_by && (
                        <button
                          style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#005734", border: "none", color: "white" }}
                          onClick={() => setEditIndex(index)}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>


    </Wrapper>

  );
};

export default ThreadComment;

