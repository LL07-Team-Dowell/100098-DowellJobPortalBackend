import React, { useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useCurrentUserContext } from '../../../../../../contexts/CurrentUserContext';

const CreateTeam = ({toggleCheckboxes, settoggleCheckboxes,changeTeamName, handleCheckboxChange ,data}) => {
  const { currentUser } = useCurrentUserContext();
  console.log(currentUser)
  return (
    <div className='overlay'>
    <div className='create_your_team'>
      <h2 className=''>Create asdasd Team</h2>
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
          {currentUser.selected_product.userportfolio.map((user, index) => user.username[0] !== 'owner' ?  (
            <div key={index}>
              <input
                type='checkbox'
                value={user}
                onChange={handleCheckboxChange}
              />
              <span>{user}</span>
            </div>
          ): null)}
          {/* {data.memebers.map((member, i) => (
            <div key={i}>
              <input
                type='checkbox'
                value={member}
                onChange={handleCheckboxChange}
              />
              <span>{member}</span>
            </div>
          ))} */}
        </div>
      ) : null}
      <br />
    </div>
    </div>
  );
};

export default CreateTeam;
