import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";

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
              <h4>Create Thread</h4>
              <p>
                Bring everyone together and get to work. Work together in a team
                to increase productivity.
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
              <p>Add Task Given daily Here.</p>
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default NewAddTaskScreen;
