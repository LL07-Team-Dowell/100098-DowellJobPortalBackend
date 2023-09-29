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
import { getAllTeams } from "../../../../services/createMembersTasks";

const AddIssueScreen = ({
  closeIssuesScreen,
  afterSelectionScreen,
  editPage,
  teamId,
  setEditPage,
  candidateView,
  teams,
  id,
}) => {
  const ref = useRef(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { currentUser } = useCurrentUserContext();
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [issueTitle, setIssueTitle] = useState('');
  const navigate = useNavigate();

  // console.log(teams);

  // console.log(teamId);
  const [createIssue, setCreateIssue] = useState({
    thread: "",
    image: "",
    team_alerted_id: "",
    created_by: currentUser.userinfo.username,
    team_id: teamId,
    previous_status: "",
  });

  // useClickOutside(ref, () => {
  //   closeIssuesScreen();
  //   !afterSelectionScreen && setEditPage(false);
  // });

  useEffect(() => {
    getAllTeams(currentUser.portfolio_info[0].org_id)
      .then((resp) => {
        // console.log(resp.data.response.data);
        setTeamNamesArray(
          resp.data.response.data
            .filter((item) => item.admin_team === true)
            .map((data) => {
              return [{ name: data.team_name }, { id: data._id }];
            })
        );
        // console.log(
        //   resp.data.response.data
        //     .filter((item) => item.admin_team === true)
        //     .map((data) => {
        //       return [{ name: data.team_name }, { id: data._id }];
        //     })
        // );
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
    const selectedTeamName = e.target.value;
    setSelectedTeam(selectedTeamName);
    const selectedTeamObj = teamNamesArray.find(
      (team) => team[0].name === selectedTeamName
    );
    console.log(selectedTeamObj);
    const selectedTeamId = selectedTeamObj ? selectedTeamObj[1].id : null;
    setCreateIssue((prevIssue) => ({
      ...prevIssue,
      team_alerted_id: selectedTeamId,
    }));
  };

  const handleCandidateTeamChange = (e) => {
    setCreateIssue((prevIssue) => {
      const newCreateIssue = { ...prevIssue };
      newCreateIssue["team_id"] = e.target.value;
      return newCreateIssue;
    });
  };

  const [teamNamesArray, setTeamNamesArray] = useState([]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setSelectedFile(selectedFile);
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
    setDisabled(true);

    // Create a FormData object to send the file
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      // Send a POST request to the upload URL
      let imageUrl = "";
      if (selectedFile) {
        const response = await fetch(
          "https://dowellfileuploader.uxlivinglab.online/uploadfiles/upload-hr-image/",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          // If the request is successful, parse the JSON response
          const data = await response.json();
          imageUrl = data.file_url;
        } else {
          // Handle the case where the request is not successful
          toast.error("Error uploading image");
        }
      }

      try {
        const response = await createThread({
          ...createIssue,
          image: imageUrl,
        });

        if (response.status === 201) {
          toast.success("Issue Created Successfully");
          navigate(`/team-screen-member/${createIssue.team_id}/team-issues`);
          setDisabled(false);
          closeIssuesScreen();
        } else {
          toast.error("Something went wrong");
          setDisabled(false);
        }
      } catch (error) {
        console.error("Something went wrong", error);
        setDisabled(false);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      toast.error("Error uploading image", error);
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
          <span>Enter Issue Title</span>
          <input
            type="text"
            placeholder="Add title"
            onChange={(e) => setIssueTitle(e.target.value)}
            style={{ margin: 0, marginBottom: "0.8rem" }}

          />
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
              style={{ display: "block" }}
            />
          )}
          {candidateView && teams && (
            <>
              <span className="selectProject">
                Select Team you want to create this issue in
              </span>
              <br />
              <select
                className="addTaskDropDown"
                style={{ margin: 0, marginBottom: "0.8rem" }}
                onChange={handleCandidateTeamChange}
                value={createIssue.team_id}
                name={"team_id"}
              >
                <option value="">Select Team</option>
                {/* Dynamically populate the options */}
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            </>
          )}
          <span className="selectProject">
            Select Team to be Notified about the issue
          </span>
          <br />
          <select
            className="addTaskDropDown"
            style={{ margin: 0, marginBottom: "0.8rem" }}
            onChange={handleOptionChange}
            value={selectedTeam}
            name={"team"}
          >
            <option value="">Select Team</option>
            {/* Dynamically populate the options */}
            {teamNamesArray.map((team) => (
              <option key={team[0].name} value={team[0].name}>
                {team[0].name}
              </option>
            ))}
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
