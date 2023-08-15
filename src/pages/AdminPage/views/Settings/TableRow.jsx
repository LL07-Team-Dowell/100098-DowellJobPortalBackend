import React, { useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
export default function TableRow({
  index,
  option,
  settingUserProfileInfo,
  rolesDict,
  currentUser,
  Proj_Lead,
  projectList,
  hiredCandidates,
  currentFilter,
  setTeamleadProject,
  availableProjects,
  updateSettingsUserProfileInfo,
  updatedUsers,
  rolesNamesDict,
}) {
  const [roleAssigned, setRoleAssigned] = useState('No role assigned');
  const [ updatedRole, setUpdatedRole ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ projectAssigned, setProjectAssigned ] = useState('No project assigned');
  const [ updatedProject, setUpdatedProject ] = useState(null);
  const roleRef = useRef();
  const projectAssignedRef = useRef();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(false);

    const [roleAssignedToPortfolio, projectAssignedToPortfolio] = [
      settingUserProfileInfo?.reverse()
      ?.find(
        (value) =>
          value?.profile_info[0]?.profile_title === option.portfolio_name
      )?.profile_info[0]?.Role
      ,
      settingUserProfileInfo?.reverse()
      ?.find(
        (value) =>
          value?.profile_info[0]?.profile_title === option.portfolio_name
      )?.profile_info[0]?.project
    ];

    setRoleAssigned(
      roleAssignedToPortfolio ?
        rolesDict[roleAssignedToPortfolio] ?
          rolesDict[roleAssignedToPortfolio]
          : 
          "Invalid role"        
      : "No Role assigned"
    )

    setProjectAssigned(
      projectAssignedToPortfolio ?
        projectAssignedToPortfolio
      :
      'No project assigned'
    )

    const timeout = setTimeout(() => {
      setLoaded(true)
    }, 300);

    return (() => {
      clearTimeout(timeout)
    })

  }, [updatedUsers, currentFilter])
  
  const submit2 = () => {
    const teamManagementProduct = currentUser.portfolio_info.find(
      (item) => item.product === "Team Management"
    );
    if (!teamManagementProduct) return;

    setLoading(true);
    axios
      .post(
        "https://100098.pythonanywhere.com/settinguserprofileinfo/",
        {
          company_id: teamManagementProduct.org_id,
          org_name: teamManagementProduct.org_name,
          owner: currentUser.userinfo.username,
          data_type: teamManagementProduct.data_type,
          profile_info: [
            {
              profile_title: option.portfolio_name,
              Role: !updatedRole ? rolesNamesDict[roleAssigned] : updatedRole,
              version: "1.0",
              project: Proj_Lead,
            },
          ],
        },
        []
      )
      .then((response) => {
        console.log(response);
        setRoleAssigned(!updatedRole ? roleAssigned : rolesDict[updatedRole]);
        setLoading(false);
        setUpdatedRole(null);
        setUpdatedProject(null);
        setProjectAssigned(Proj_Lead);
        updateSettingsUserProfileInfo([response.data, ...settingUserProfileInfo])
        toast.success(`Successfully updated role for ${option.portfolio_name}`)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false);
        setUpdatedRole(null);
        setUpdatedProject(null);
      });
  };
  // console.log({ roleAssigned });

  const handleCancelRoleUpdate = () => {
    
    setUpdatedRole(null);
    setUpdatedProject(null);

    if (projectAssigned === 'No project assigned') {
      projectAssignedRef.current.value = ''
    } else {
      projectAssignedRef.current.value = projectAssigned;
    };

    const currentRoleVal = Object.keys(rolesDict).find(role => rolesDict[role] === roleAssigned);
    if (currentRoleVal) roleRef.current.value = currentRoleVal;
  }

  if (!loaded) return <></>

  return (
    <tr>
      {" "}
      <td>{index + 1}</td>
      <td>{option.portfolio_name}</td>
      <td>{roleAssigned}</td>
      <td
        style={{
          color: hiredCandidates.includes(option.portfolio_name) ?
            '#005734' 
            :
            '#ff0000'
          ,
        }}  
      >
        {
          hiredCandidates.includes(option.portfolio_name) ?
          'Yes' :
          'No'
        }
      </td>
      <td>
        <select 
          defaultValue={availableProjects.includes(projectAssigned) ? projectAssigned : ""} 
          onChange={({ target }) => {
            setTeamleadProject(target.value)
            setUpdatedProject(true);
          }} 
          style={{
            backgroundColor: ((roleAssigned === 'Teamlead' && hiredCandidates.includes(option.portfolio_name)) || (updatedRole && rolesDict[updatedRole] === 'Teamlead')) ? '#fff' : `#f5f5f5`,
            filter: ((roleAssigned === 'Teamlead' && hiredCandidates.includes(option.portfolio_name)) || (updatedRole && rolesDict[updatedRole] === 'Teamlead')) ? 'brightness(1)': 'brightness(0.9)',
            cursor: ((roleAssigned === 'Teamlead' && hiredCandidates.includes(option.portfolio_name)) || (updatedRole && rolesDict[updatedRole] === 'Teamlead')) ? 'pointer' : 'not-allowed',
            maxWidth: '50%'
          }}
          disabled={!((roleAssigned === 'Teamlead' && hiredCandidates.includes(option.portfolio_name)) || (updatedRole && rolesDict[updatedRole] === 'Teamlead'))}
          ref={projectAssignedRef}
        >
          <option value="" disabled>Set project</option>
          {availableProjects.map((projectValue, index) => (
            <option key={index} value={projectValue}>
              {projectValue}
            </option>
          ))}
        </select>
      </td>
      <td 
        className="update__Role"
      >
        <select 
          defaultValue={Object.keys(rolesNamesDict).find(item => item === roleAssigned) ? rolesNamesDict[roleAssigned] : ""} 
          onChange={({ target }) => setUpdatedRole(target.value)} 
          style={{
            // pointerEvents: hiredCandidates.includes(option.portfolio_name) ? 'all' : 'none',
            backgroundColor: hiredCandidates.includes(option.portfolio_name) ? '#fff' : `#f5f5f5`,
            filter: hiredCandidates.includes(option.portfolio_name) ? 'brightness(1)': 'brightness(0.9)',
            cursor: hiredCandidates.includes(option.portfolio_name) ? 'pointer' : 'not-allowed'
          }}
          disabled={!hiredCandidates.includes(option.portfolio_name)}
          ref={roleRef}
        >
          <option value="" disabled>Update role</option>
          {Object.keys(rolesDict).map((role, index) => (
            <option key={index} value={role}>
              {rolesDict[role]}
            </option>
          ))}
        </select>
        {
          ((updatedProject) || (updatedRole && roleAssigned !== rolesDict[updatedRole])) && <div className="update__Role__For__Portfolio__Wrapper">
            <button disabled={loading} className="update__Role__For__Portfolio__Btn green" onClick={() => submit2()}>
              {
                loading ? <LoadingSpinner width={'0.8rem'} height={'0.8rem'} /> :
                <AiOutlineCheck />
              }
            </button>
            <button disabled={loading} className="update__Role__For__Portfolio__Btn red" onClick={handleCancelRoleUpdate}>
              <AiOutlineClose />
            </button>
          </div>
        }
      </td>
    </tr>
  );
}
