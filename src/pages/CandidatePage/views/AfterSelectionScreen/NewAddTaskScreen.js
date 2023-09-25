import React, { useState } from "react";
import { AiOutlineAim, AiOutlinePlusCircle } from "react-icons/ai";


const NewAddTaskScreen = ({ 
  handleAddTaskBtnClick, 
  handleAddIssueBtnClick, 
  isTeamlead,
  handleViewIndividualTaskBtn,
  handleViewTeamTaskBtn,
}) => {
  return (
    <>
      <div className="new__task__container">
        { 
          !isTeamlead && 
          <h1 style={{ color: "#005734", fontSize: "1.6rem" }}>Add New Item</h1> 
        }
        <div style={{ position: "relative", display: "flex", gap: "3rem" }} className="child-task-create">
          {
            !isTeamlead && <div style={{ marginTop: 30 }} className="Create_Team" onClick={handleAddIssueBtnClick}>
              <div>
                <div>
                  <AiOutlinePlusCircle
                    className="icon"
                    style={{ fontSize: "2rem" }}
                  />
                </div>
                <h4>Create Issues</h4>
                <p>
                  Create, monitor and get quick feedback on issues encountered in our products.
                </p>
              </div>
            </div>
          }
          <div style={{ marginTop: 30 }} className="Create_Team" onClick={handleAddTaskBtnClick}>
            <div>
              <div>
                <AiOutlinePlusCircle
                  className="icon"
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>Add Work log</h4>
              <p>Keep track of tasks given and milestones completed while working on a project.</p>
            </div>
          </div>
          {
            isTeamlead && <>
              <div style={{ marginTop: 30 }} className="Create_Team" onClick={handleViewIndividualTaskBtn}>
                <div>
                    <div>
                        <AiOutlineAim
                          className="icon"
                          style={{ fontSize: "2rem" }}
                        />
                    </div>
                    <h4>View added work logs</h4>
                    <p>
                        View the work logs you have added.
                    </p>
                </div>
              </div>

              <div style={{ marginTop: 30 }} className="Create_Team" onClick={handleViewTeamTaskBtn}>
                <div>
                    <div>
                        <AiOutlineAim
                          className="icon"
                          style={{ fontSize: "2rem" }}
                        />
                    </div>
                    <h4>View team's work logs</h4>
                    <p>
                        View work logs added by your team members.
                    </p>
                </div>
            </div>
            </>
          }
        </div>
      </div>
    </>
  );
};

export default NewAddTaskScreen;
