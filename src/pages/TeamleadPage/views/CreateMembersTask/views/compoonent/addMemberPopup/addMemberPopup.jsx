import React, { useState } from 'react'
import './addMemberPopup.scss'
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import { EditTeam } from '../../../../../../../services/createMembersTasks';
import { toast } from 'react-toastify';

const returnMissingMember = (bigMember,smallMember) => {
    let data = bigMember
    smallMember.forEach(element => {
      data =data.filter(e => e !== element)
    });
    return data
}

const AddMemberPopup = ({bigMember, smallMember,team_name, setmembers ,close}) => {
  const { currentUser } = useCurrentUserContext();
    const [displayMembers , setdisplayMembers] = useState(returnMissingMember(bigMember, smallMember));
    const [addedMembers , setAddedMembers] = useState([]); 
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
    
        if (checked) {
            setAddedMembers((prevSelectedItems) => [...prevSelectedItems, value]);
        } else {
            setAddedMembers((prevSelectedItems) =>
            prevSelectedItems.filter((item) => item !== value)
          );
        }
      };
      const EditTeamFunction = () => {
        console.log(currentUser.portfolio_info[0].org_id,[...smallMember,...addedMembers])
        EditTeam(currentUser.portfolio_info[0].org_id,{team_name,members:[...smallMember ,...addedMembers]})
          .then(resp => {
            console.log(resp);
            setmembers([...smallMember ,...addedMembers]);
            toast.success("Edit Team Successfully");
            close()
          })
          .catch(err => {
            console.log(err)
          })
      }
      return (
    <div className='add-member-popup'>
      <div className='members'>
        {displayMembers.map((item) => (
        <div key={item}>
          <label>
            <input
              type="checkbox"
              value={item}
              checked={addedMembers.includes(item)}
              onChange={handleCheckboxChange}
            />
            {item}
          </label>
        </div>
      ))}
      </div>
      <button onClick={()=>EditTeamFunction()}>Edit Team </button>
    </div>
  )
}

export default AddMemberPopup