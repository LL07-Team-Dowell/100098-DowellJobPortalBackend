import React, { useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';

const CreateTeam = ({toggleCheckboxes, settoggleCheckboxes,changeTeamName, handleCheckboxChange ,data}) => {
  
  return (
    <div className='create_your_team'>
      <h2 className=''>Create Your Team</h2>
      <label htmlFor='team_name'>Team Name</label>
      <input
        type='text'
        id='team_name'
        className=''
        placeholder='Choose a Team Name'
        onChange={changeTeamName}
      />
      <br />
      <label htmlFor='team_description'>Team Description</label>
      <textarea
        type='text'
        id='team_description'
        className=''
        placeholder='Choose a Team Name'
        rows={10}
      />
      <br />

      <label htmlFor=''>Add Member</label>
      <div
        className='add_member_input'
        onClick={() => settoggleCheckboxes(!toggleCheckboxes)}
      >
        <p>Choose team members</p>
        <AiOutlinePlusCircle className='icon' />
      </div>
      <br />
      {toggleCheckboxes ? (
        <div className='checkboxes'>
          {data.memebers.map((member, i) => (
            <div key={i}>
              <input
                type='checkbox'
                value={member}
                onChange={handleCheckboxChange}
              />
              <span>{member}</span>
            </div>
          ))}
        </div>
      ) : null}
      <br />
    </div>
  );
};

export default CreateTeam;
