import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import useClickOutside from "../../../../hooks/useClickOutside";
import { IoIosArrowBack } from "react-icons/io";

import "../AddTaskScreen/style.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { createCandidateTask } from "../../../../services/candidateServices";
import { toast } from "react-toastify";
import { createThread } from "../../../../services/threadServices";
import { useValues } from "../CreateMembersTask/context/Values";
import { getAllTeams } from "../../../../services/createMembersTasks";
import { useTeam } from "../../../CandidatePage/views/TeamsScreen/useTeams";

const AddIssueScreen = ({
  teamMembers,
  closeIssuesScreen,
  updateIssues,
  afterSelectionScreen,
  editPage,
  setEditPage,
  taskToEdit,
  hrPageActive,
  assignedProject,
}) => {
  const ref = useRef(null);
  const { id } = useParams();
  const { team, setteam } = useTeam();
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useCurrentUserContext();
  const [optionValue, setoptionValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { data, setdata } = useValues();
  const [response, setresponse] = useState(false);
  const [teamName , setTeamName] = useState('') ;

  const [createIssue, setCreateIssue] = useState({
    thread: "",
    image: "",
    team_alearted_id: "",
    created_by: currentUser.userinfo.username,
  });

  useClickOutside(ref, () => {
    closeIssuesScreen();
    !afterSelectionScreen && setEditPage(false);
  });

  useEffect(() => {
    getAllTeams(currentUser.portfolio_info[0].org_id)
      .then((resp) => {
        console.log(resp.data.response.data);
        setdata(resp.data.response.data.find((team) => team["_id"] === id));
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleChange = (valueEntered, inputName) => {
    setCreateIssue((prev) => {
      const newCreateIssue = { ...prev };
      newCreateIssue[inputName] = valueEntered;
      return newCreateIssue;
    });
  };

  const handleOptionChange = (e) => {
    setoptionValue(e.target.value);
    setCreateIssue((prev) => {
      const newCreateIssue = { ...prev };
      newCreateIssue["team_alearted_id"] = e.target.value;
      return newCreateIssue;
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setCreateIssue((prev) => {
      const newCreateIssue = { ...prev };
      newCreateIssue["image"] = e.target.files[0];
      return newCreateIssue;
    });
  };

  useEffect(() => {
    if (createIssue.thread.length < 1) return setShowIssueForm(false);
    setShowIssueForm(true);
  }, [createIssue.thread]);

  useEffect(() => {
    if (createIssue.thread.length < 1) return setDisabled(true);
    setDisabled(false);
  }, [createIssue.thread]);

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    // console.log(createIssue);

    try {
      const response = await createThread(createIssue);
      console.log(response.data);
      if (response.status === 201) {
        toast.success("Issue Created Successfully");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="add__New__Task__Overlay">
        <div className="add__New__Task__Container" ref={ref}>
          <h1 className="title__Item">
            Add New Issue
            <AiOutlineClose
              onClick={() => {
                closeIssuesScreen();
                !afterSelectionScreen && setEditPage(false);
              }}
              style={{ cursor: "pointer" }}
              fontSize={"1.2rem"}
            />
          </h1>
          <span className="selectProject">Enter Issue Details</span>
          <textarea
            placeholder="Enter Issue"
            name={"thread"}
            value={createIssue.thread}
            style={{ margin: 0, marginBottom: "0.8rem" }}
            onChange={(e) => handleChange(e.target.value, e.target.name)}
            rows={5}
          ></textarea>
          <span className="selectProject">
            Add an Image to help explain your issue better (OPTIONAL)
          </span>
          <input
            type="file"
            placeholder="Add Image"
            onChange={handleFileChange}
            style={{ margin: 0, marginBottom: "0.8rem" }}
          />
          {selectedFile && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Uploaded Preview"
            />
          )}
          <span className="selectProject">
            Select Team to be Notified about the issue
          </span>
          <br />
          <select
            className="addTaskDropDown"
            style={{ margin: 0, marginBottom: "0.8rem" }}
            onChange={handleOptionChange}
            id="team"
            name={"team"}
          >
            <option value="">Select Team</option>
            <option
              value="Team Development A"
              selected={optionValue === "Team Development A"}
            >
              Team Development A
            </option>
            <option
              value="Team Development B"
              selected={optionValue === "Team Development B"}
            >
              Team Development B
            </option>
            <option
              value="Team Development C"
              selected={optionValue === "Team Development C"}
            >
              Team Development C
            </option>
            <option
              value="Team Development D"
              selected={optionValue === "Team Development D"}
            >
              Team Development D
            </option>
          </select>
          <button
            type={"button"}
            className="add__Task__Btn"
            disabled={disabled}
            onClick={(e) => handleCreateIssue(e)}
          >
            {editPage ? "Update Issue" : "Add Issue"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddIssueScreen;
