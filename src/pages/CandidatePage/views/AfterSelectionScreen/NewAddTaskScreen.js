import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";

const NewAddTaskScreen = ({ handleAddTaskBtnClick }) => {

  return (
    <>
      <Navbar title=" Add New Item" color={"#005734"} removeButton={true} />
      <div style={{ position: "relative"}}>
        <div className="new__task__container">
          <div style={{ marginTop: 30 }} className=" Create_Team">
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
        </div>
        <div
          className="new__task__container"
          onClick={handleAddTaskBtnClick}
        >
          <div style={{ marginTop: 30 }} className=" Create_Team">
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
