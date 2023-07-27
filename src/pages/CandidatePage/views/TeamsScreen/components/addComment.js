import React, { useState } from "react";
import userIcon from "../assets/user_icon.png";

const Comment = ({
  text,
  handleChange,
  comments,
  commentInput,
  user,
  handleSubmit,
  submitLabel,
  setText,
}) => {

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(text);
    setText("");
  }


  return (
    <>
      <form onSubmit={onSubmit}>
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Enter your comment..."
          className={commentInput}
        />
        <button>{submitLabel}</button>
      </form>
      <div>
        <div style={{ fontSize: "0.8rem", marginBottom: "0.6rem" }}>
          Comments
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div>
            <img src={userIcon} alt="userIcon" width={35} height={35} />
          </div>
          <div>
            <p style={{ fontWeight: "600" }}>{user}</p>
            <p>{comments}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Comment;



