// import React, { useEffect, useRef, useState } from "react";
// import { AiOutlineClose } from "react-icons/ai";
// import { IoIosArrowBack } from "react-icons/io";
// import "../../../../AddTaskScreen/style.css";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// // import { createThread } from "../../../../services/threadServices";

// import useClickOutside from "../../../../../../../hooks/useClickOutside";
// import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
// import { createThread } from "../../../../../../../services/threadServices";
// import { getAllTeams } from "../../../../../../../services/createMembersTasks";

// const AddIssueTeamLead = ({
//   closeIssuesScreen,
//   afterSelectionScreen,
//   editPage,
//   teamId,
//   setEditPage,
//   candidateView,
//   teams,
// }) => {
//   const ref = useRef(null);
//   const [showIssueForm, setShowIssueForm] = useState(false);
//   const [disabled, setDisabled] = useState(true);
//   const { currentUser } = useCurrentUserContext();
//   const [selectedTeam, setSelectedTeam] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [createIssue, setCreateIssue] = useState({
//     thread: "",
//     image: "",
//     team_alerted_id: "",
//     created_by: currentUser.userinfo.username,
//     team_id: teamId,
//     previous_status: "",
//   });



//   useClickOutside(ref, () => {
//     closeIssuesScreen();
//     !afterSelectionScreen && setEditPage(false);
//   });

//   useEffect(() => {
//     getAllTeams(currentUser.portfolio_info[0].org_id)
//       .then((resp) => {
//         // console.log(resp.data.response.data);
//         setTeamNamesArray(
//           resp.data.response.data
//             .filter((item) => item.admin_team === true)
//             .map((data) => {
//               return [{ name: data.team_name }, { id: data._id }];
//             })
//         );
//         console.log(
//           resp.data.response.data
//             .filter((item) => item.admin_team === true)
//             .map((data) => {
//               return [{ name: data.team_name }, { id: data._id }];
//             })
//         );
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }, []);

//   const handleChange = (valueEntered, inputName) => {
//     setCreateIssue((prev) => {
//       const newCreateIssue = { ...prev };
//       newCreateIssue[inputName] = valueEntered;
//       return newCreateIssue;
//     });
//   };

//   const handleOptionChange = (e) => {
//     const selectedTeamName = e.target.value;
//     setSelectedTeam(selectedTeamName);
//     const selectedTeamObj = teamNamesArray.find(
//       (team) => team[0].name === selectedTeamName
//     );
//     console.log(selectedTeamObj);
//     const selectedTeamId = selectedTeamObj ? selectedTeamObj[1].id : null;
//     setCreateIssue((prevIssue) => ({
//       ...prevIssue,
//       team_alerted_id: selectedTeamId,
//     }));
//   };

//   const handleCandidateTeamChange = (e) => {
//     setCreateIssue((prevIssue) => {
//       const newCreateIssue = { ...prevIssue };
//       newCreateIssue["team_id"] = e.target.value;
//       return newCreateIssue;
//     });
//   };

//   const [teamNamesArray, setTeamNamesArray] = useState([]);

//   const handleFileChange = async (e) => {
//     const selectedFile = e.target.files[0];
//     setSelectedFile(selectedFile);
//   };

//   useEffect(() => {
//     if (createIssue.thread.length < 1) return setShowIssueForm(false);
//     setShowIssueForm(true);
//   }, [createIssue.thread]);

//   useEffect(() => {
//     if (createIssue.thread.length < 1) return setDisabled(true);
//     setDisabled(false);
//   }, [createIssue.thread]);

//   // const handleCreateIssue = async (e) => {
//   //   e.preventDefault();
//   //   // console.log(createIssue);
//   //   setDisabled(true);

//   //   // Create a FormData object to send the file
//   //   const formData = new FormData();
//   //   formData.append("image", selectedFile);

//   //   try {
//   //     // Send a POST request to the upload URL
//   //     const response = await fetch(
//   //       "http://67.217.61.253/uploadfiles/upload-hr-image/",
//   //       {
//   //         method: "POST",
//   //         body: formData,
//   //       }
//   //     );

//   //     if (response.ok) {
//   //       const data = await response.json();
//   //       const imageUrl = data.file_url;

//   //       try {
//   //         const response = await createThread({ ...createIssue, image: imageUrl });
//   //         console.log(response.data);
//   //         if (response.status === 201) {
//   //           toast.success("Issue Created Successfully");
//   //           navigate(`/team-screen-member/${id}/issue-inprogress`)
//   //           setDisabled(false);
//   //           closeIssuesScreen();
//   //         }
//   //       } catch (error) {
//   //         toast.error("Something went wrong");
//   //         setDisabled(false);
//   //       }
//   //     } else {
//   //       // Handle the case where the request is not successful
//   //       console.error("Error uploading image");
//   //     }
//   //   } catch (error) {
//   //     // Handle any errors that occurred during the request
//   //     console.error("Error uploading image", error);
//   //   }
//   // };


//   const handleCreateIssue = async (e) => {
//     e.preventDefault();
//     setDisabled(true);

//     const formData = new FormData();

//     // Check if an image is selected before appending to FormData
//     if (selectedFile) {
//       formData.append("image", selectedFile);
//     }

//     try {
//       // Upload image if selectedFile exists
//       let imageUrl = "";
//       if (selectedFile) {
//         const response = await fetch(
//           "http://67.217.61.253/uploadfiles/upload-hr-image/",
//           {
//             method: "POST",
//             body: formData,
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           imageUrl = data.file_url;
//         } else {
//           console.error("Error uploading image");
//         }
//       }

//       try {
//         // Create the issue with the provided data and imageUrl
//         const response = await createThread({
//           ...createIssue,
//           image: imageUrl, // Assign the imageUrl, whether it's empty or from the upload
//         });

//         if (response.status === 201) {
//           toast.success("Issue Created Successfully");
//           navigate(`/team-screen-member/${id}/issue-inprogress`);
//           setDisabled(false);
//           closeIssuesScreen();
//         }
//       } catch (error) {
//         toast.error("Something went wrong");
//         setDisabled(false);
//       }
//     } catch (error) {
//       console.error("Error uploading image", error);
//     }
//   };

//   return (
//     <>
//       <div className="add__New__Task__Overlay">
//         <div className="add__New__Task__Container" ref={ref}>
//           <h1 className="title__Item">
//             Add New Issue
//             <AiOutlineClose
//               onClick={() => {
//                 closeIssuesScreen();
//                 !afterSelectionScreen && setEditPage(false);
//               }}
//               style={{ cursor: "pointer" }}
//               fontSize={"1.2rem"}
//             />
//           </h1>
//           <span className="selectProject">Enter Issue Details</span>
//           <textarea
//             placeholder="Enter Issue"
//             name={"thread"}
//             value={createIssue.thread}
//             style={{ margin: 0, marginBottom: "0.8rem" }}
//             onChange={(e) => handleChange(e.target.value, e.target.name)}
//             rows={5}
//           ></textarea>
//           <span className="selectProject">
//             Add an Image to help explain your issue better (OPTIONAL)
//           </span>
//           <input
//             type="file"
//             placeholder="Add Image"
//             onChange={handleFileChange}
//             style={{ margin: 0, marginBottom: "0.8rem" }}
//           />
//           {selectedFile && (
//             <img
//               src={URL.createObjectURL(selectedFile)}
//               alt="Uploaded Preview"
//             />
//           )}
//           {candidateView && teams && (
//             <>
//               <span className="selectProject">
//                 Select Team you want to create this issue in
//               </span>
//               <br />
//               <select
//                 className="addTaskDropDown"
//                 style={{ margin: 0, marginBottom: "0.8rem" }}
//                 onChange={handleCandidateTeamChange}
//                 value={createIssue.team_id}
//                 name={"team_id"}
//               >
//                 <option value="">Select Team</option>
//                 {/* Dynamically populate the options */}
//                 {teams.map((team) => (
//                   <option key={team._id} value={team._id}>
//                     {team.team_name}
//                   </option>
//                 ))}
//               </select>
//             </>
//           )}
//           <span className="selectProject">
//             Select Team to be Notified about the issue
//           </span>
//           <br />
//           <select
//             className="addTaskDropDown"
//             style={{ margin: 0, marginBottom: "0.8rem" }}
//             onChange={handleOptionChange}
//             value={selectedTeam}
//             name={"team"}
//           >
//             <option value="">Select Team</option>
//             {/* Dynamically populate the options */}
//             {teamNamesArray.map((team) => (
//               <option key={team[0].name} value={team[0].name}>
//                 {team[0].name}
//               </option>
//             ))}
//           </select>
//           <button
//             type={"button"}
//             className="add__Task__Btn"
//             disabled={disabled}
//             onClick={(e) => handleCreateIssue(e)}
//           >
//             {editPage ? "Update Issue" : "Add Issue"}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddIssueTeamLead;


import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";

import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
// import { createCandidateTask } from "../../../../services/candidateServices";
import { toast } from "react-toastify";


import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import { createThread } from "../../../../../../../services/threadServices";
import { getAllTeams } from "../../../../../../../services/createMembersTasks";
import useClickOutside from "../../../../../../../hooks/useClickOutside";

const AddIssueTeamLead = ({
  closeIssuesScreen,
  afterSelectionScreen,
  editPage,
  teamId,
  setEditPage,
  candidateView,
  teams,
}) => {
  const ref = useRef(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { currentUser } = useCurrentUserContext();
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams()
  console.log(teams);

  console.log(teamId);
  const [createIssue, setCreateIssue] = useState({
    thread: "",
    thread_title: "",
    steps_to_reproduce_thread: "",
    expected_product_behavior: "",
    actual_product_behavior: "",
    image: "",
    team_alerted_id: "",
    created_by: currentUser.userinfo.username,
    team_id: teamId,
    thread_type: "",
    previous_status: "",
  });


  // useClickOutside(ref, () => {
  //   closeIssuesScreen();
  //   !afterSelectionScreen && setEditPage(false);
  // });
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
        console.log(
          resp.data.response.data
            .filter((item) => item.admin_team === true)
            .map((data) => {
              return [{ name: data.team_name }, { id: data._id }];
            })
        );
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

  const handleSecondOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setCreateIssue((prev) => {
      const newCreateIssue = { ...prev };
      newCreateIssue["thread_type"] = e.target.value;
      return newCreateIssue;
    });
  };
  const handleCandidateTeamChange = (e) => {
    setCreateIssue((prevIssue) => {
      const newCreateIssue = { ...prevIssue };
      newCreateIssue["team_id"] = e.target.value;
      return newCreateIssue;
    });
  };

  const [teamNamesArray, setTeamNamesArray] = useState([]);

  // const handleFileChange = async (e) => {
  //   const selectedFile = e.target.files[0];
  //   setSelectedFile(selectedFile);
  // };

  // useEffect(() => {
  //   if (createIssue.thread.length < 1) return setShowIssueForm(false);
  //   setShowIssueForm(true);
  // }, [createIssue.thread]);

  // useEffect(() => {
  //   if (createIssue.thread.length < 1) return setDisabled(true);
  //   setDisabled(false);
  // }, [createIssue.thread]);

  // const handleCreateIssue = async (e) => {
  //   e.preventDefault();
  //   // console.log(createIssue);
  //   setDisabled(true);

  //   // Create a FormData object to send the file
  //   const formData = new FormData();
  //   formData.append("image", selectedFile);

  //   try {
  //     // Send a POST request to the upload URL
  //     const response = await fetch(
  //       "http://67.217.61.253/uploadfiles/upload-hr-image/",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     if (response.ok) {
  //       // If the request is successful, parse the JSON response
  //       const data = await response.json();
  //       console.log(data);
  //       // Assuming the response contains a field called "imageUrl"
  //       const imageUrl = data.file_url;

  //       try {
  //         const response = await createThread({ ...createIssue, image: imageUrl });
  //         console.log(response.data);
  //         if (response.status === 201) {
  //           toast.success("Issue Created Successfully");
  //           setDisabled(false);
  //         }
  //       } catch (error) {
  //         toast.error("Something went wrong");
  //         setDisabled(false);
  //       }
  //     } else {
  //       // Handle the case where the request is not successful
  //       console.error("Error uploading image");
  //     }
  //   } catch (error) {
  //     // Handle any errors that occurred during the request
  //     console.error("Error uploading image", error);
  //   }
  // };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setSelectedFile(selectedFile);
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const formData = new FormData();

    // Check if an image is selected before appending to FormData
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      // Upload image if selectedFile exists
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
          const data = await response.json();
          imageUrl = data.file_url;
        } else {
          console.error("Error uploading image");
        }
      }

      try {
        // Create the issue with the provided data and imageUrl
        const response = await createThread({
          ...createIssue,
          image: imageUrl, // Assign the imageUrl, whether it's empty or from the upload
        });

        if (response.status === 201) {
          toast.success("Issue Created Successfully");
          navigate(`/team-screen-member/${id}/issue-inprogress`);
          setDisabled(false);
          closeIssuesScreen();
        }
      } catch (error) {
        toast.error("Something went wrong");
        setDisabled(false);
      }
    } catch (error) {
      console.error("Error uploading image", error);
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
          <span className="selectProject">Enter Issue Title</span>
          <input
            placeholder="Enter Issue"
            name={"thread_title"}
            value={createIssue.thread_title}
            style={{ margin: 0, marginBottom: "0.8rem" }}
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          ></input>

          <span className="selectProject">Enter Issue Details</span>
          <textarea
            placeholder="Enter Issue"
            name={"thread"}
            value={createIssue.thread}
            style={{ margin: 0, marginBottom: "0.8rem" }}
            onChange={(e) => handleChange(e.target.value, e.target.name)}
            rows={5}
          ></textarea>

          <span className="selectProject">Step to Reproduce Thread</span>
          <textarea
            placeholder="Enter steps to reproduce thread"
            name={"steps_to_reproduce_thread"}
            value={createIssue.steps_to_reproduce_thread}
            style={{ margin: 0, marginBottom: "0.8rem" }}
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          ></textarea>

          <span className="selectProject">Expected Product Behavior</span>
          <textarea
            placeholder="Enter Expected Product Behavior"
            name={"expected_product_behavior"}
            value={createIssue.expected_product_behavior}
            style={{ margin: 0, marginBottom: "0.8rem" }}
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          ></textarea>

          <span className="selectProject">Actual product behavior</span>
          <textarea
            placeholder="Enter Actual product behavior"
            name={"actual_product_behavior"}
            value={createIssue.actual_product_behavior}
            style={{ margin: 0, marginBottom: "0.8rem" }}
            onChange={(e) => handleChange(e.target.value, e.target.name)}
          ></textarea>

          <span className="selectProject">Choose Issue Type</span>
          <div style={{ display: "flex", gap: "1rem" }}>
            <label htmlFor="BUG" className="radio">
              <input
                className="radio_input dio"
                type={"radio"}
                id={"BUG"}
                name="options"
                value={"BUG"}
                checked={selectedOption === "BUG"}
                onChange={handleSecondOptionChange}
              />
              <div className="radio__radio"></div>
              <p>Bug</p>
            </label>
            <label htmlFor="SUGGESTION" className="radio">
              <input
                className="radio_input"
                type={"radio"}
                id={"SUGGESTION"}
                name="options"
                value={"SUGGESTION"}
                checked={selectedOption === "SUGGESTION"}
                onChange={handleSecondOptionChange}
              />
              <div className="radio__radio"></div>
              <p>Suggestion</p>
            </label>
          </div>


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
                disabled
              >
                {/* Dynamically populate the options */}
                {teams.map((team) => (
                  <option key={team._id} value={team._id} disabled>
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
            {/*  */}
            {editPage ? "Update Issue" : "Add Issue"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddIssueTeamLead;

