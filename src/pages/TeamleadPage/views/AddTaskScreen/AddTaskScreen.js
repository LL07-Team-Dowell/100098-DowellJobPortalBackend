import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import useClickOutside from "../../../../hooks/useClickOutside";
import { IoIosArrowBack } from "react-icons/io";

import "./style.css";
import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { createCandidateTask } from "../../../../services/candidateServices";
import { toast } from "react-toastify";


const AddTaskScreen = ({ teamMembers, closeTaskScreen, updateTasks, afterSelectionScreen, editPage, setEditPage, taskToEdit, hrPageActive, assignedProject }) => {

    const ref = useRef(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTaskDetails, setNewTaskDetails] = useState({
        "username": "",
        "title": "",
        "description": "",
        "status": "Incomplete",
    });
    const [disabled, setDisabled] = useState(true);
    const navigate = useNavigate();
    const { currentUser } = useCurrentUserContext();
    const [time, settime] = useState(new Date().toString());
    const TimeValue = `${time.split(" ")[0]} ${time.split(" ")[1]} ${time.split(" ")[2]} ${time.split(" ")[3]}`
    const [optionValue, setoptionValue] = useState("");
    const selctChange = (e) => {
        setoptionValue(e.target.value);
    }
    function convertDateFormat(date) {
        const dateObj = new Date(date);
        const month = dateObj.getMonth() + 1; // Months are zero-based
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const seconds = dateObj.getSeconds();

        const formattedDate = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDate);
        return formattedDate;
    }


    const formattedDate = convertDateFormat(time);
    console.log(formattedDate);

    // console.log(time);
    useClickOutside(ref, () => { closeTaskScreen(); !afterSelectionScreen && setEditPage(false) });

    // useEffect (() => {

    //     if (newTaskDetails.username.length < 1) return setShowTaskForm(false);

    //     if ((newTaskDetails.title.length < 1) || (newTaskDetails.description.length < 1)) return setDisabled(true)

    //     setDisabled(false)

    // }, [newTaskDetails])
    useEffect(() => {
        if (newTaskDetails.description.length < 1 || optionValue.length < 1) return setDisabled(true);
        setDisabled(false)

    }, [newTaskDetails.description, optionValue]);
    const CreateNewTaskFunction = () => {
        setDisabled(true)
        const dataToPost = {
            project: optionValue,
            applicant: currentUser.userinfo.username,
            task: newTaskDetails.description,
            task_added_by: currentUser.userinfo.username,
            data_type: currentUser.portfolio_info[0].data_type,
            company_id: currentUser.portfolio_info[0].org_id,
            task_created_date: formattedDate
        }
        createCandidateTask(dataToPost).then(resp => {
            console.log(resp);
            updateTasks((prevTasks) => {
                return [...prevTasks, { ...dataToPost, status: newTaskDetails.status }]
            })
            setNewTaskDetails({ ...newTaskDetails, "description": "" });
            setoptionValue("");
            toast.success("New task sucessfully added")
            setDisabled(false)
            closeTaskScreen();
        })
            .catch(err => {
                console.log(err);
                setDisabled(false)
            })
    }
    useEffect(() => {

        if (afterSelectionScreen) {
            setNewTaskDetails(prevValue => { return { ...prevValue, username: currentUser.userinfo.username } });
            setShowTaskForm(true);
        }

    }, [afterSelectionScreen])

    useEffect(() => {
        if (editPage) {

            setNewTaskDetails({
                username: taskToEdit.user,
                title: taskToEdit.title,
                description: taskToEdit.description,
            });
            setShowTaskForm(true);

        }
    }, [editPage])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTaskDetails(prevValue => { return { ...prevValue, [name]: value } })
    }

    const handleMemberItemClick = (member) => {
        setNewTaskDetails(prevValue => { return { ...prevValue, "username": member } });
        setShowTaskForm(true);
    }

    const handleNewTaskBtnClick = async () => {

        // setDisabled(true);

        // const dataToSend = { ...newTaskDetails };
        // dataToSend.user = newTaskDetails.username;
        // delete dataToSend["username"];

        // try{

        //     const response = await addNewTask(dataToSend);

        //     if (!afterSelectionScreen) updateTasks(prevTasks => { return [ ...prevTasks.filter(task => task.user !== dataToSend.user) ] });
        //     updateTasks(prevTasks => { return [ response.data, ...prevTasks ] } );
        //     closeTaskScreen();
        //     (afterSelectionScreen || hrPageActive) ? navigate("/tasks") : navigate("/task");

        // } catch (err) {
        //     console.log(err);
        //     setDisabled(false);
        // }

    }

    const handleUpdateTaskBtnClick = async () => {

        // setDisabled(true);

        // const dataToSend = { ...newTaskDetails };
        // dataToSend.user = newTaskDetails.username;
        // delete dataToSend["username"];

        // try{

        //     await updateSingleTask(taskToEdit.id + "/", dataToSend)

        //     taskToEdit.title = dataToSend.title;
        //     taskToEdit.description = dataToSend.description;

        //     updateTasks(prevTasks => prevTasks.map(task => {

        //         if (task.id === taskToEdit.id) {
        //             return { ...task, title: dataToSend.title, description: dataToSend.description }
        //         }

        //         return task;

        //     }) );

        //     closeTaskScreen();
        //     navigate("/task");

        // } catch (err) {
        //     console.log(err);
        //     setDisabled(false);
        // }

    }

    return <>
        <div className="add__New__Task__Overlay">
            <div className="add__New__Task__Container" ref={ref}>
                <h1 className="title__Item">
                    {
                        showTaskForm ? <>
                            {!afterSelectionScreen && <IoIosArrowBack onClick={editPage ? () => { closeTaskScreen(); setEditPage(false); } : () => setShowTaskForm(false)} style={{ cursor: "pointer" }} />}
                            {editPage ? "Edit Task" : "New Task Details"}
                        </> : <>Add new task</>
                    }

                    <AiOutlineClose onClick={() => { closeTaskScreen(); !afterSelectionScreen && setEditPage(false) }} style={{ cursor: "pointer" }} fontSize={'1.2rem'} />
                </h1>
                {
                    showTaskForm ? <>
                        <span className="selectProject">Username</span>
                        <input type={"text"} placeholder={"Task Assignee"} value={newTaskDetails.username} style={{ margin: 0, marginBottom: "0.8rem" }} readOnly={true} />
                        <span className="selectProject">Date of Submission</span>
                        <input type={"text"} placeholder={"today time"} value={TimeValue} style={{ margin: 0, marginBottom: "0.8rem" }} readOnly={true} />
                        <span className="selectProject">Select Project</span>
                        <br />
                        <select onChange={e => selctChange(e)} className="addTaskDropDown" style={{ margin: 0, marginBottom: "0.8rem"  }} ><option value={""}>Select</option>{assignedProject.map((v, i) => <option key={i} value={v}>{v}</option>)}</select>
                        <span className="selectProject">Enter Task Details</span>
                        <textarea placeholder="Enter Task" name="description" value={newTaskDetails.description} style={{ margin: 0 }} onChange={handleChange} rows={5}></textarea>
                        <button type={"button"} className="add__Task__Btn" disabled={disabled} onClick={() => editPage ? handleUpdateTaskBtnClick() : CreateNewTaskFunction()}>{editPage ? "Update Task" : "Add Task"}</button>
                    </> :

                        <>
                            {
                                teamMembers.length < 1 ? <>
                                    <h4>Your team members will appear here</h4>
                                </> :
                                    <>
                                        <h4>Your team members ({teamMembers.length})</h4>
                                        <div className="team__Members__Container">
                                            {
                                                React.Children.toArray(teamMembers.map(member => {
                                                    return <p className="team__Member__Item" onClick={() => handleMemberItemClick(member.applicant)}>{member.applicant}</p>
                                                }))
                                            }
                                        </div>
                                    </>
                            }
                        </>
                }
            </div>
        </div>
    </>
}

export default AddTaskScreen;
