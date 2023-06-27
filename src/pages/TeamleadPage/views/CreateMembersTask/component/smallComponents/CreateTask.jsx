import React, { useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';

const CreateTask = ({ toggleCheckboxes, settoggleCheckboxes, handleCheckboxChange2, data, createSingleMemberTask ,projectname ,setprojectname ,singlemembertask ,setsinglemembertask }) => {
    console.log({data})

  return (
    <>
      <div className='add_member_input' onClick={() => settoggleCheckboxes(!toggleCheckboxes)}>
        <p>Choose team members</p>
        <AiOutlinePlusCircle className='icon' />
      </div>
      <br />
      {toggleCheckboxes && (
        <div className='membersRadios'>
          {data.memebers.map((member, i) => (
            <React.Fragment key={i}>
              <input
                type='radio'
                value={member}
                onChange={handleCheckboxChange2}
                checked={member === data.selected_members[0]}
                className=''
              />
              {member}
              <br />
            </React.Fragment>
          ))}
        </div>
      )}
      <input
        type='text'
        className='project-name-member'
        placeholder='Project name'
        value={projectname}
        onChange={(e) => setprojectname(e.target.value)}
      />
      <input
        type='text'
        placeholder='Task name'
        className='task-name-member'
        value={singlemembertask}
        onChange={(e) => setsinglemembertask(e.target.value)}
      />
      <button
        className='add-task-member-btn'
        onClick={projectname && singlemembertask ? createSingleMemberTask : null}
      >
        Add Task for Single Member
      </button>
    </>
  );
};

export default CreateTask;
