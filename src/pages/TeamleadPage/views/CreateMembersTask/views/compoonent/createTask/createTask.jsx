import React, { useEffect, useState } from "react";
import "./createTask.scss";
import { useValues } from "../../../context/Values";
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import {
  createTeam,
  createTeamTask,
} from "../../../../../../../services/createMembersTasks";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import LittleLoading from "../../../../../../CandidatePage/views/ResearchAssociatePage/littleLoading";
import LoadingSpinner from "../../../../../../../components/LoadingSpinner/LoadingSpinner";
import { BsPlus } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
const CreateTask = ({ id, members, unShowCreateTask, setTasks, tasks }) => {
  // USER
  const { currentUser } = useCurrentUserContext();
  // DATA
  const { data, setdata } = useValues();
  // States
  const [name, setname] = useState("");
  const [description, setdiscription] = useState("");
  const [singleTask, setSingleTask] = useState(false);
  const [choosed, setchoosed] = useState(false);
  const [taskMembers, setTaskMembers] = useState([]);
  const [loading, setloading] = useState(false);
  const [inputMembers, setInputMembers] = useState([]);
  const [date, setDate] = useState(undefined);
  const [subTask, setSubTask] = useState("");
  const [displaidMembers, setDesplaidMembers] = useState(
    members.map((member, index) => ({ id: index, member }))
  );
  const [query, setquery] = useState("");

  const AddedMember = (id) => {
    if (!singleTask) {
      setInputMembers([
        ...inputMembers,
        displaidMembers.find((f) => f.id === id),
      ]);
      setDesplaidMembers(displaidMembers.filter((f) => f.id !== id));
    } else {
      if (inputMembers.length === 0) {
        setInputMembers([displaidMembers.find((f) => f.id === id)]);
        setDesplaidMembers(displaidMembers.filter((p) => p.id !== id));
      } else {
        const memberIDRemove = inputMembers[0].id;
        setInputMembers([displaidMembers.find((f) => f.id === id)]);
        setDesplaidMembers([
          ...displaidMembers.filter((p) => p.id !== id),
          inputMembers[0],
        ]);
      }
    }
  };
  const removeMember = (id) => {
    setInputMembers(inputMembers.filter((f) => f.id !== id));
    setDesplaidMembers([
      ...displaidMembers,
      inputMembers.find((f) => f.id === id),
    ]);
  };
  const createTeamTaskFunction = () => {
    if (!loading) {
      if (name && description && inputMembers.length > 0) {
        setloading(true);
        createTeamTask({
          assignee: inputMembers.map((v) => v.member),
          title: name,
          description: description,
          team_id: id,
          completed: false,
          due_date: new Date().toDateString(),
        })
          // RESPONSE
          .then((resp) => {
            console.log(resp);
            toast.success("task created successfully");
            unShowCreateTask();
            setloading(false);
            console.log({
              assignee: inputMembers.map((v) => v.member),
              title: name,
              description: description,
              team_id: id,
              completed: false,
              due_date: new Date().toDateString(),
            });
            setTasks((tasks) => [
              ...tasks,
              {
                title: name,
                description: description,
                completed: false,
                due_date: new Date().toDateString(),
                _id: new Date().getTime().toString(),
                assignee: inputMembers.map((v) => v.member),
              },
            ]);
          })
          // ERROR
          .catch((err) => {
            toast.error("task error");
            console.log(err);
            setloading(false);
          });
      } else {
        toast.error("Complete all fields before submitting");
        setloading(false);
      }
    }
  };

  useEffect(() => {
    setTaskMembers([]);
  }, [singleTask]);

  return (
    <div className='overlay'>
      <div className='create-new-task' tabIndex={0}>
        <h2 className=''>Create New Task</h2>
        <label htmlFor='task_name'>Task Name</label>
        <input
          className='input'
          type='text'
          id='task_name'
          placeholder='Choose a Task Name'
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
        <br />
        <label htmlFor='task_description'>Task Description</label>
        <textarea
          type='text'
          id='team_description'
          className=''
          placeholder='Choose a Task Description'
          rows={10}
          value={description}
          onChange={(e) => setdiscription(e.target.value)}
        />
        <br />

        <label htmlFor='task_name'>Sub Tasks</label>
        <input
          className='input'
          type='text'
          id='task_name'
          placeholder='Choose a Sub Tasks'
          value={name}
          onChange={(e) => setname(e.target.value)}
        />

        <br />

        <label htmlFor='task_name'>Date</label>
        <input
          className='input'
          type='date'
          id='task_name'
          placeholder='Choose a Date'
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
        {/*  */}
        {name && description ? (
          <div>
            <label>Task Type</label>
            <div>
              <div className='task-type'>
                <div>
                  <input
                    className='input'
                    id='single_task'
                    type='radio'
                    checked={singleTask && choosed}
                    onChange={() => {
                      setSingleTask(true);
                      setchoosed(true);
                      setTaskMembers([]);
                    }}
                  />
                  <p>single Task</p>
                </div>
                <div>
                  <input
                    className='input'
                    id='team_task'
                    type='radio'
                    checked={!singleTask && choosed}
                    onChange={() => {
                      setSingleTask(false);
                      setchoosed(true);
                      setTaskMembers([]);
                    }}
                  />
                  <p>Team Task</p>
                </div>
              </div>
              {choosed && name && description ? (
                <>
                  <label>Task Members</label>
                  <div className='added-members-input'>
                    {inputMembers.map((v) => (
                      <div key={v.id} onClick={() => removeMember(v.id)}>
                        <p>{v.member}</p>
                        <FaTimes fontSize={"small"} />
                      </div>
                    ))}
                    <input
                      type='text'
                      placeholder='search member'
                      value={query}
                      onChange={(e) => setquery(e.target.value)}
                    />
                  </div>
                  <div></div>
                  <br />
                  <label htmlFor='task_name'>Select Members</label>
                  <div className='members'>
                    {displaidMembers.filter((f) =>
                      f.member
                        .toLocaleLowerCase()
                        .includes(query.toLocaleLowerCase())
                    ).length > 0 ? (
                      displaidMembers
                        .filter((f) =>
                          f.member
                            .toLocaleLowerCase()
                            .includes(query.toLocaleLowerCase())
                        )
                        .map((element) => (
                          <div
                            className='single-member'
                            onClick={() => AddedMember(element.id)}
                          >
                            <p>{element.member}</p>
                            <BsPlus />
                          </div>
                        ))
                    ) : (
                      <h3>No More Members</h3>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className='buttons'>
          <button onClick={createTeamTaskFunction}>
            {loading ? (
              <LoadingSpinner color={"white"} width='20px' height='20px' />
            ) : (
              "submit"
            )}
          </button>
          <button onClick={unShowCreateTask}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
