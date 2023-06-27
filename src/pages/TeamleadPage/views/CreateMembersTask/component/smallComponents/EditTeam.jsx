import React from 'react'
import Checkbox from '../Checkbox';

const EditTeam = ({choosedTeam,data,patchTeam }) => {
    return (
        <>
          <h1>{choosedTeam.value}</h1>
          {data.memebers.map((member, i) => (
            <>
              <Checkbox
                choosedTeamValue={choosedTeam.value}
                membersEditTeam={data.membersEditTeam}
                Member={member}
                key={i}
              />
            </>
          ))}
          <>
            <br />
            <button onClick={patchTeam}>edit</button>
          </>
        </>
      );
      
}

export default EditTeam