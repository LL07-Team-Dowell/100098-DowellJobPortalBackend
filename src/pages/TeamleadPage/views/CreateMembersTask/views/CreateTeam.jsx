import React, { useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useValues } from '../context/Values';

const CreateTeam = () => {
  const { data, setdata } = useValues();
  const [showCard, setshowCard] = useState(false);
  const [toggleCheckboxes, settoggleCheckboxes] = useState(false);

  const changeTeamName = (e) => {
    setdata({ ...data, team_name: e.target.value });
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setdata({ ...data, selected_members: [...data.selected_members, value] });
    } else {
      setdata({ ...data, selected_members: data.selected_members.filter((box) => box !== value) });
    }
  };

  return (
    <div className='container' style={{ position: 'relative' }}>
      <div className='Create_Team' onClick={() => { setshowCard(!showCard) }}>
        <div>
          <div>
            <AiOutlinePlusCircle className='icon' />
          </div>
          <h4>Create a Team</h4>
          <p>
            Bring everyone together and get to work. Work together in a team to increase productivity.
          </p>
        </div>
      </div>
      {showCard ? (
        <div className='create_your_team' style={{ position: 'absolute', top: '20%', left: '20%', background: 'white', padding: 20 }} tabIndex={0}  onBlur={() =>{setshowCard(false);console.log("asdasdasdjhasdj h askjdhasdjashd") }}>
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
              {data.members.map((member, i) => (
                <p key={i}>
                  <input
                    type='checkbox'
                    value={member}
                    onChange={handleCheckboxChange}
                  />
                  {member}
                </p>
              ))}
            </div>
          ) : null}
          <br />
          <div className="buttons">
            <button>Next</button>
            <button>Cancel</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CreateTeam;
