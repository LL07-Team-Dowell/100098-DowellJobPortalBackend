import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";


const NewAddTaskScreen = ({ handleAddTaskBtnClick }) => {
  return (
    <>
      <div className="new__task__container">
        <h1 style={{ color: "#005734", fontSize: "1.6rem" }}>Add New Item</h1>
        <div style={{ position: "relative", display: "flex", gap: "3rem" }}>
          <div style={{ marginTop: 30 }} className="Create_Team">
            <div>
              <div>
                <AiOutlinePlusCircle
                  className="icon"
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>Create Issues</h4>
              <p>
                Create, monitor and get quick feedback on issues ecountered in our products.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 30 }} className="Create_Team" onClick={handleAddTaskBtnClick}>
            <div>
              <div>
                <AiOutlinePlusCircle
                  className="icon"
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>Add Task</h4>
              <p>Keep track of tasks given and milestones completed while working on a project.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewAddTaskScreen;
