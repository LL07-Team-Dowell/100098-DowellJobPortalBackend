import React, { useState } from "react";
import userIcon from "../assets/user_icon.png";

const Comment = ({ text, handleChange, comments, commentInput, user }) => {
  return (
    <>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Enter your comment..."
        className={commentInput}
      />
      <div style={{ display:"flex", gap: "1rem" }}>
        <div>
          <img src={userIcon} alt="userIcon" width={35} height={35}/>
        </div>
        <div>
          <p style={{ fontWeight: "600" }}>{user}</p>
          <p>{comments}</p>
        </div>
      </div>
    </>
  );
};

export default Comment;
