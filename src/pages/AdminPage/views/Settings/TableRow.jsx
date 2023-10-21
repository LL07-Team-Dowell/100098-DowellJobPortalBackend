import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AiOutlineArrowLeft, AiOutlineCheck, AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import { adminAddNewSettingProfile, adminEditUserSettingProfile } from "../../../../services/adminServices";
import './index.scss';
import useClickOutside from "../../../../hooks/useClickOutside";
import useClickInside from "../../../../hooks/useClickInside";
import { teamManagementProductName } from "../../../../utils/utils";

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
  currentSearch,
}) {
  const [roleAssigned, setRoleAssigned] = useState('No role assigned');
  const [ updatedRole, setUpdatedRole ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ projectAssigned, setProjectAssigned ] = useState('No project assigned');
  const [ updatedProject, setUpdatedProject ] = useState(null);
  const roleRef = useRef();
  const projectAssignedRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const [ currentSettingItem, setCurrentSettingItem ] = useState(null);
  const [ reload, setReload ] = useState(false);
  const [ additionalRolesAssigned, setAdditionalRolesAssigned ] = useState([]);
  const [ updatedRolesAssigned, setUpdatedRolesAssigned ] = useState([]);
  const [ additionalRoleSearch, setAdditionalRoleSearch ] = useState('');
  const [ additionalProjectsAssigned, setAdditionalProjectsAssigned ] = useState([]);
  const [ updatedProjectsAssigned, setUpdatedProjectsAssigned ] = useState([]);
  const [ additionalProjectSearch, setAdditionalProjectSearch ] = useState('');
  const [ showAdditionalRoleSelection, setShowAdditionalRoleSelection ] = useState('none');
  const [ showAdditionalProjectSelection, setShowAdditionalProjectSelection ] = useState('none');
  const [ projectInputFocused, setProjectInputFocused ] = useState(false);
  const [ roleInputFocused, setRoleInputFocused ] = useState(false);
  const projectSearchRef = useRef();
  const roleSearchRef = useRef();
  
  useEffect(() => {
    setLoaded(false);

    const foundUserSettingItem = settingUserProfileInfo?.reverse()
    ?.find(
      (value) =>
        value?.profile_info[value?.profile_info?.length - 1]?.profile_title === option.portfolio_name
    );

    setCurrentSettingItem(foundUserSettingItem);

    const [roleAssignedToPortfolio, projectAssignedToPortfolio, additionalRoles, additionalProjects] = [
      foundUserSettingItem?.profile_info[foundUserSettingItem?.profile_info.length - 1]?.Role
      ,
      foundUserSettingItem?.profile_info[foundUserSettingItem?.profile_info.length - 1]?.project,
      foundUserSettingItem?.profile_info[foundUserSettingItem?.profile_info.length - 1]?.other_roles,
      foundUserSettingItem?.profile_info[foundUserSettingItem?.profile_info.length - 1]?.additional_projects,
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

    if (projectAssignedToPortfolio) {
      setTeamleadProject(projectAssignedToPortfolio);
    }

    if (additionalProjects) {
      setAdditionalProjectsAssigned(additionalProjects);
      setUpdatedProjectsAssigned(additionalProjects);  
    }

    if (additionalRoles) {
      setAdditionalRolesAssigned(additionalRoles);
      setUpdatedRolesAssigned(additionalRoles);  
    }
    
    const timeout = setTimeout(() => {
      setLoaded(true)
    }, 100);

    return (() => {
      clearTimeout(timeout)
    })

  }, [updatedUsers, currentFilter, availableProjects, hiredCandidates, currentSearch, reload])


  useClickInside(projectSearchRef, () => setProjectInputFocused(true));
  useClickOutside(projectSearchRef, () => setProjectInputFocused(false));
  useClickInside(roleSearchRef, () => setRoleInputFocused(true));
  useClickOutside(roleSearchRef, () => setRoleInputFocused(false));

  
  const submit2 = () => {
    const teamManagementProduct = currentUser.portfolio_info.find(
      (item) => item.product === teamManagementProductName
    );
    if (!teamManagementProduct) return;

    if (updatedRole && rolesDict[updatedRole] === "Teamlead" && Proj_Lead.length < 1 && projectAssigned === 'No project assigned') return toast.info("Please assign a project for teamlead");
    if (updatedRole && rolesDict[updatedRole] === "Group Lead" && Proj_Lead.length < 1 && projectAssigned === 'No project assigned') return toast.info("Please assign a project for grouplead");

    setLoading(true);

    if (currentSettingItem) {
      
      const foundIndexOfItem = settingUserProfileInfo?.findIndex(
        (value) =>
          value?.id === currentSettingItem?.id
      );

      const dataToPost = {
        profile_title: option.portfolio_name,
        Role: !updatedRole ? rolesNamesDict[roleAssigned] : updatedRole,
        project: Proj_Lead,
      }

      if (updatedRolesAssigned.length > 0) {
        dataToPost.other_roles = updatedRolesAssigned;
      }

      if (updatedProjectsAssigned.length > 0) {
        dataToPost.additional_projects = updatedProjectsAssigned
      }

      adminEditUserSettingProfile(currentSettingItem?.id, dataToPost).then(res => {
        setRoleAssigned(!updatedRole ? roleAssigned : rolesDict[updatedRole]);
        setLoading(false);
        resetState();
        toast.success(`Successfully updated role for ${option.portfolio_name}`)

        if (foundIndexOfItem === -1) return
        const copyOfSettingUserInfo = settingUserProfileInfo?.slice();
        copyOfSettingUserInfo[foundIndexOfItem].profile_info = res.data?.profile_info;
        updateSettingsUserProfileInfo(copyOfSettingUserInfo);
        setReload(!reload);
      }).catch(err => {
        console.log(err)
        setLoading(false);
        toast.error(`An error occurred while trying to update setting for ${option?.portfolio_name}`)
        // setUpdatedRole(null);
        // setUpdatedProject(null);
      })
      return
    }

    adminAddNewSettingProfile
      (
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
      )
      .then((response) => {
        console.log(response);
        setRoleAssigned(!updatedRole ? roleAssigned : rolesDict[updatedRole]);
        setLoading(false);
        setUpdatedRole(null);
        setUpdatedProject(null);
        setProjectAssigned(Proj_Lead);
        setReload(!reload);

        const copyOfSettingUserInfo = settingUserProfileInfo?.slice();
        copyOfSettingUserInfo.push(response.data);
        updateSettingsUserProfileInfo(copyOfSettingUserInfo)
        toast.success(`Successfully created role for ${option.portfolio_name}`)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false);
        toast.error(`An error occurred while trying to configure setting for ${option?.portfolio_name}`)
        // setUpdatedRole(null);
        // setUpdatedProject(null);
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

  const handleAddAdditionalRole = (val) => {
    const prevRoles = updatedRolesAssigned.slice();
    prevRoles.push(val);
    setUpdatedRolesAssigned(prevRoles);
    setAdditionalRoleSearch('');
  }

  const handleAddAdditionalProject = (val) => {
    const prevProjects = updatedProjectsAssigned.slice();
    prevProjects.push(val);
    setUpdatedProjectsAssigned(prevProjects);
    setAdditionalProjectSearch('');
  }

  const handleRemoveRole = (val) => {
    const prevRoles = updatedRolesAssigned.slice();
    setUpdatedRolesAssigned(prevRoles.filter(role => role !== val));
  }

  const handleRemoveProject = (val) => {
    const prevRoles = updatedProjectsAssigned.slice();
    setUpdatedProjectsAssigned(prevRoles.filter(project => project !== val));
  }

  const handleCancelAdditionalRoleUpdate = () => {
    const currentAdditionalRoles = additionalRolesAssigned.slice();
    setUpdatedRolesAssigned(currentAdditionalRoles);
    setShowAdditionalRoleSelection('none');
  }

  const handleCancelAdditionalProjectUpdate = () => {
    const currentAdditionalProjects = additionalProjectsAssigned.slice();
    setUpdatedProjectsAssigned(currentAdditionalProjects);
    setShowAdditionalProjectSelection('none');
  }

  const resetState = () => {
    setUpdatedRole(null);
    setUpdatedProject(null);
    setProjectAssigned(Proj_Lead);
    
    setAdditionalProjectsAssigned([]);
    setUpdatedProjectsAssigned([]);

    setAdditionalRolesAssigned([]);
    setUpdatedRolesAssigned([]);

    setAdditionalProjectSearch('');
    setAdditionalRoleSearch('');

    setShowAdditionalRoleSelection('none');
    setShowAdditionalProjectSelection('none');
  }

  if (!loaded) return <></>

  return (
    <tr>
      {" "}
      <td>{index + 1}</td>
      <td className="portfolio__Name">{option.portfolio_name}</td>
      <td>{roleAssigned}</td>
      <td>
        <div className="additional__Item__Col">
          {
            showAdditionalRoleSelection === 'none' ? 
            <div className="additional__Buttons__Wrapper">
              <button 
                className="additional__Item__Btn" 
                onClick={() => setShowAdditionalRoleSelection('edit')}
                disabled={hiredCandidates.includes(option.portfolio_name) ? false : true}
              >
                {additionalRolesAssigned.length > 0 ? "Edit" : "Add"}
              </button>
              {
                additionalRolesAssigned.length > 0 && 
                <button 
                  className="additional__Item__Btn" 
                  onClick={() => setShowAdditionalRoleSelection('view')}
                  disabled={hiredCandidates.includes(option.portfolio_name) ? false : true}
                >
                  View
                </button> 
              }
            </div> :
            showAdditionalRoleSelection === 'view' ? <>
              <div className="single__Additional__Wrapper">
                {
                  React.Children.toArray(additionalRolesAssigned.map(role => {
                    return <div className="single__Additional__Item view">
                      <span>{rolesDict[role]}</span>
                    </div>
                  }))
                }
              </div>
              <div className="additional__Buttons__Wrapper">
                <button className="additional__Item__Btn back" onClick={() => setShowAdditionalRoleSelection('none')}><AiOutlineArrowLeft /></button>
              </div>
            </> :
            showAdditionalRoleSelection === 'edit' ?
            <>
              <div className="single__Additional__Wrapper">
                {
                  React.Children.toArray(updatedRolesAssigned.map(role => {
                    return <div className="single__Additional__Item">
                      <span>{rolesDict[role]}</span>
                      <AiOutlineClose onClick={() => handleRemoveRole(role)}/>
                    </div>
                  }))
                }
              </div>
              <div className="select__Additional__Item__Wrapper" ref={roleSearchRef}>
                <div className="select__Additional__Item__Search">
                  <AiOutlineSearch />
                  <input 
                    placeholder="Add role" 
                    value={additionalRoleSearch}
                    onChange={({ target }) => setAdditionalRoleSearch(target.value)}
                  />
                </div>
                {
                  (additionalRoleSearch.length > 0 || roleInputFocused) &&
                  <ul className="select__Additional__Item">
                    {
                      Object.keys(rolesDict)
                      .filter(role => role !== rolesNamesDict.Candidate)
                      .filter(roleKey => roleAssigned !== rolesDict[roleKey])
                      .filter(roleKey => !updatedRolesAssigned.includes(roleKey)) 
                      .filter(roleKey => rolesDict[roleKey].toLocaleLowerCase().includes(additionalRoleSearch.toLocaleLowerCase())).length < 1 ?
                        <p>No roles found</p>
                      :
                      React.Children.toArray(
                        Object.keys(rolesDict)
                        .filter(role => role !== rolesNamesDict.Candidate)
                        .filter(roleKey => roleAssigned !== rolesDict[roleKey])
                        .filter(roleKey => rolesDict[roleKey].toLocaleLowerCase().includes(additionalRoleSearch.toLocaleLowerCase()))
                        .filter(roleKey => !updatedRolesAssigned.includes(roleKey))
                      .map(roleKey => {
                        return <li onClick={() => handleAddAdditionalRole(roleKey)}>{rolesDict[roleKey]}</li>
                      }))
                    }
                  </ul>
                }
                
              </div>
              <div className="update__Role__For__Portfolio__Wrapper">
                <button disabled={loading} className="update__Role__For__Portfolio__Btn green" onClick={() => submit2()}>
                  {
                    loading ? <LoadingSpinner width={'0.8rem'} height={'0.8rem'} /> :
                    <AiOutlineCheck />
                  }
                </button>
                <button disabled={loading} className="update__Role__For__Portfolio__Btn red" onClick={handleCancelAdditionalRoleUpdate}>
                  <AiOutlineClose />
                </button>
              </div>
            </> :
            <></>
          }
        </div>
      </td>
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
            backgroundColor: (
                (roleAssigned === 'Teamlead' && hiredCandidates.includes(option.portfolio_name)) || 
                (updatedRole && rolesDict[updatedRole] === 'Teamlead') ||
                (roleAssigned === 'Group Lead' && hiredCandidates.includes(option.portfolio_name)) || 
                (updatedRole && rolesDict[updatedRole] === 'Group Lead')
              ) ? '#fff' 
              : 
              `#f5f5f5`
            ,
            filter: (
                (roleAssigned === 'Teamlead' && hiredCandidates.includes(option.portfolio_name)) || 
                (updatedRole && rolesDict[updatedRole] === 'Teamlead') ||
                (roleAssigned === 'Group Lead' && hiredCandidates.includes(option.portfolio_name)) || 
                (updatedRole && rolesDict[updatedRole] === 'Group Lead')
              ) ? 'brightness(1)'
              : 
              'brightness(0.9)'
            ,
            cursor: (
                (roleAssigned === 'Teamlead' && hiredCandidates.includes(option.portfolio_name)) || 
                (updatedRole && rolesDict[updatedRole] === 'Teamlead') ||
                (roleAssigned === 'Group Lead' && hiredCandidates.includes(option.portfolio_name)) || 
                (updatedRole && rolesDict[updatedRole] === 'Group Lead')
              ) ? 'pointer' 
              : 
              'not-allowed'
            ,
            maxWidth: '50%'
          }}
          disabled={!(
            (roleAssigned === 'Teamlead' && hiredCandidates.includes(option.portfolio_name)) || 
            (updatedRole && rolesDict[updatedRole] === 'Teamlead') ||
            (roleAssigned === 'Group Lead' && hiredCandidates.includes(option.portfolio_name)) || 
            (updatedRole && rolesDict[updatedRole] === 'Group Lead')
          )}
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
      <td>
      <div className="additional__Item__Col">
          {
            showAdditionalProjectSelection === 'none' ? 
            <div className="additional__Buttons__Wrapper">
              <button 
                className="additional__Item__Btn" 
                onClick={() => setShowAdditionalProjectSelection('edit')}
                disabled={
                  !(
                    (roleAssigned === 'Teamlead' && hiredCandidates.includes(option.portfolio_name)) || 
                    (updatedRole && rolesDict[updatedRole] === 'Teamlead')
                  )
                }
              >
                {additionalProjectsAssigned.length > 0 ? "Edit" : "Add"}
              </button>
              {
                additionalProjectsAssigned.length > 0 && 
                <button 
                  className="additional__Item__Btn" 
                  onClick={() => setShowAdditionalProjectSelection('view')}
                  disabled={
                    !(
                      (roleAssigned === 'Teamlead' && hiredCandidates.includes(option.portfolio_name)) || 
                      (updatedRole && rolesDict[updatedRole] === 'Teamlead')
                    )
                  }
                >
                  View
                </button> 
              }
            </div> :
            showAdditionalProjectSelection === 'view' ? <>
              <div className="single__Additional__Wrapper">
                {
                  React.Children.toArray(additionalProjectsAssigned.map(project => {
                    return <div className="single__Additional__Item view">
                      <span>{project}</span>
                    </div>
                  }))
                }
              </div>
              <div className="additional__Buttons__Wrapper">
                <button className="additional__Item__Btn back" onClick={() => setShowAdditionalProjectSelection('none')}><AiOutlineArrowLeft /></button>
              </div>
            </> :
            showAdditionalProjectSelection === 'edit' ?
            <>
              <div className="single__Additional__Wrapper">
                {
                  React.Children.toArray(updatedProjectsAssigned.map(project => {
                    return <div className="single__Additional__Item">
                      <span>{project}</span>
                      <AiOutlineClose onClick={() => handleRemoveProject(project)}/>
                    </div>
                  }))
                }
              </div>
              <div className="select__Additional__Item__Wrapper" ref={projectSearchRef}>
                <div className="select__Additional__Item__Search">
                  <AiOutlineSearch />
                  <input 
                    placeholder="Add project" 
                    value={additionalProjectSearch}
                    onChange={({ target }) => setAdditionalProjectSearch(target.value)}
                  />
                </div>
                {
                  (additionalProjectSearch.length > 0 || projectInputFocused) &&
                  <ul className="select__Additional__Item">
                    {
                      availableProjects
                      .filter(project => project !== projectAssigned)
                      .filter(project => !updatedProjectsAssigned.includes(project)) 
                      .filter(project => project.toLocaleLowerCase().includes(additionalProjectSearch.toLocaleLowerCase())).length < 1 ?
                        <p>No roles found</p>
                      :
                      React.Children.toArray(
                        availableProjects
                        .filter(project => project !== projectAssigned)
                        .filter(project => project.toLocaleLowerCase().includes(additionalProjectSearch.toLocaleLowerCase()))
                        .filter(project => !updatedProjectsAssigned.includes(project))
                      .map(project => {
                        return <li onClick={() => handleAddAdditionalProject(project)}>{project}</li>
                      }))
                    }
                  </ul>
                }
                
              </div>
              <div className="update__Role__For__Portfolio__Wrapper">
                <button disabled={loading} className="update__Role__For__Portfolio__Btn green" onClick={() => submit2()}>
                  {
                    loading ? <LoadingSpinner width={'0.8rem'} height={'0.8rem'} /> :
                    <AiOutlineCheck />
                  }
                </button>
                <button disabled={loading} className="update__Role__For__Portfolio__Btn red" onClick={handleCancelAdditionalProjectUpdate}>
                  <AiOutlineClose />
                </button>
              </div>
            </> :
            <></>
          }
        </div>
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
