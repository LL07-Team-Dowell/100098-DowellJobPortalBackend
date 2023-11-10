import { useState, useEffect, useRef } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"
import axios from 'axios';
import './index.scss'
import Alert from "./component/Alert";
import { getUserInfoFromLoginAPI } from "../../../../services/authServices";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { getSettingUserProfileInfo, configureSettingUserProfileInfo } from "../../../../services/settingServices";
import { useJobContext } from "../../../../contexts/Jobs";
import { adminAddNewSettingProfile, getApplicationForAdmin } from "../../../../services/adminServices";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import { testingRoles } from "../../../../utils/testingRoles";
import { MdArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { IoFilterOutline } from "react-icons/io5";
import TableRow from "./TableRow";
import { getSettingUserProject } from "../../../../services/hrServices";
import { AiOutlineSearch } from "react-icons/ai";
import { teamManagementProductName } from "../../../../utils/utils";

export const rolesDict = { 
  "Dept_Lead": 'Account', 
  "Proj_Lead": 'Teamlead', 
  "Hr": "Hr", 
  "sub_admin": "Sub Admin", 
  "group_lead": "Group Lead", 
  "super_admin": "Super Admin",
  "candidate": "Candidate",
  'Viewer': 'Viewer',
  'Project_Lead': 'Project Lead',
};

export const rolesNamesDict = {
  'Account': "Dept_Lead", 
  'Teamlead': "Proj_Lead", 
  "Hr": "Hr", 
  "Sub Admin": "sub_admin", 
  "Group Lead": "group_lead", 
  "Super Admin": "super_admin",
  "Candidate": "candidate",
  "Viewer": "Viewer",
  "Project Lead": "Project_Lead",
}

const AdminSettings = () => {
  const { currentUser, setCurrentUser } = useCurrentUserContext();
  console.log({ CURRENTUSER: currentUser })
  const [firstSelection, setFirstSelection] = useState("");
  const [secondSelection, setSecondSelection] = useState("");
  const [data, setData] = useState("");
  const [showSecondSelection, setShowSecondSelection] = useState(false);
  const [options1, setOptions1] = useState(currentUser?.userportfolio?.filter(member => member.member_type !== "owner"));
  const [options2, setOptions2] = useState(rolesDict);
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settingUserProfileInfo, setSettingUsetProfileInfo] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [userstatus, setuserstatus] = useState('');
  const [Proj_Lead, setProj_Lead] = useState('');
  const { list, setlist } = useJobContext();
  const [ usersToDisplay, setUsersToDisplay ] = useState([]);
  const [ rowsToDisplayPerPage, setRowsToDisplayPerPage ] = useState(5);
  const [ indexes, setIndexes ] = useState({
    start: 0,
    end: rowsToDisplayPerPage,
  });
  const [ currentRoleFilter, setCurrentRoleFilter ] = useState('all');
  const roleFilterRef = useRef();
  const [ hiredCandidates, setHiredCandidates ] = useState([]);
  const [ allProjects, setAllProjects ] = useState([]);
  const [ searchValue, setSearchValue ] = useState("");


  useEffect(() => {
    if (firstSelection.length > 0) {
      const status = list?.reverse()?.find(p => p.portfolio_name === firstSelection)?.status;
      const selectedPortfolioIsOwner = currentUser?.userportfolio?.find(user => user.portfolio_name === firstSelection && user.role === 'owner');

      if (selectedPortfolioIsOwner) return setuserstatus(candidateStatuses.ONBOARDING);
      if (!status) return setuserstatus('');
      setuserstatus(status);
    }
  }, [firstSelection])
  console.log({ loading, loading2 })

  useEffect(() => {

    if (
      (
        currentUser.settings_for_profile_info && 
        currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1].Role === testingRoles.superAdminRole
      ) || 
      (
        currentUser.isSuperAdmin
      )
    ) return setLoading2(false);

    // User portfolio has already being loaded
    if (currentUser?.userportfolio?.length > 0) return setLoading2(false)

    const currentSessionId = sessionStorage.getItem("session_id");

    if (!currentSessionId) return setLoading2(false)
    const teamManagementProduct = currentUser?.portfolio_info.find(item => item.product === teamManagementProductName && item.member_type === 'owner');
    if (!teamManagementProduct) return setLoading2(false)

    const dataToPost = {
      session_id: currentSessionId,
      product: teamManagementProduct.product,
    }
    getUserInfoFromLoginAPI(dataToPost).then(res => {
      setCurrentUser(res.data);
      setLoading2(false)

    }).catch(err => {
      console.log("Failed to get user details from login API");
      console.log(err.response ? err.response.data : err.message);
    })

  }, [])

  useEffect(() => {
    setOptions1(currentUser?.userportfolio?.filter(member => member.member_type !== "owner"))
  }, [currentUser])

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(false)
      }, 2500)
    }
  }, [alert])

  useEffect(() => {

    setUsersToDisplay(
      currentRoleFilter === 'yes' ?
        searchValue.length > 0 ?
          options1?.filter(user => 
            settingUserProfileInfo?.reverse()?.find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name)
          )?.filter(item => item)?.filter(item => item.portfolio_name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
          .slice(indexes.start, indexes.end)
        :
        options1?.filter(user => settingUserProfileInfo?.reverse()?.find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name))?.filter(item => item)?.slice(indexes.start, indexes.end)
      :
      currentRoleFilter === 'no' ?
        searchValue.length > 0 ?
          options1?.filter(user => 
            !settingUserProfileInfo?.reverse()?.find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name)
          )?.filter(item => item)?.filter(item => item.portfolio_name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
          .slice(indexes.start, indexes.end)
        :
        options1?.filter(user => !settingUserProfileInfo?.reverse()?.find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name))?.filter(item => item)?.slice(indexes.start, indexes.end)
      :
      currentRoleFilter === 'hired' ?
        searchValue.length > 0 ?
          options1?.filter(user => 
            hiredCandidates.includes(user.portfolio_name)
          )?.filter(item => item.portfolio_name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
          .slice(indexes.start, indexes.end)
        :
        options1?.filter(user => hiredCandidates.includes(user.portfolio_name))?.slice(indexes.start, indexes.end)
      :
      currentRoleFilter === 'teamlead' ?
        searchValue.length > 0 ?
          options1?.filter(user => 
            settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name) && 
            settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name && value["profile_info"][value.profile_info.length - 1]["Role"] === rolesNamesDict.Teamlead)
          )?.filter(item => item)?.filter(item => item.portfolio_name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
          .slice(indexes.start, indexes.end)
        :
        options1?.filter(user => 
          settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name) && 
          settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name && value["profile_info"][value.profile_info.length - 1]["Role"] === rolesNamesDict.Teamlead)
        )?.filter(item => item)?.slice(indexes.start, indexes.end)
      :
      currentRoleFilter === 'grouplead' ?
        searchValue.length > 0 ?
          options1?.filter(user => 
            settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name) && 
            settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name && value["profile_info"][value.profile_info.length - 1]["Role"] === rolesNamesDict["Group Lead"])
          )?.filter(item => item)?.filter(item => item.portfolio_name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
          .slice(indexes.start, indexes.end)
        :
        options1?.filter(user => 
          settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name) && 
          settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name && value["profile_info"][value.profile_info.length - 1]["Role"] === rolesNamesDict["Group Lead"])
        )?.filter(item => item)?.slice(indexes.start, indexes.end)
      :

      searchValue.length > 0 ?
        options1?.filter(user => user.portfolio_name?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))?.slice(indexes.start, indexes.end)
      :
      options1?.slice(indexes.start, indexes.end)
    );

  }, [options1, indexes, currentRoleFilter, searchValue])

  useEffect(() => {

    if (!Array.isArray(list)) return

    setHiredCandidates([...new Set(list?.filter(item => item.status === candidateStatuses.ONBOARDING && item.portfolio_name)?.map(user => user.portfolio_name))])
  }, [list])

  const handleFirstSelectionChange = (event) => {
    const selection = event.target.value;
    // setData(options1.find(option => option.portfolio_name === selection))
    setData(selection)
    setFirstSelection(selection);
    setShowSecondSelection(true);
  };

  const handleSecondSelectionChange = (event) => {
    setSecondSelection(event.target.value);
  };
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getSettingUserProfileInfo(),
      getSettingUserProject(),
    ]).then(res => {
      setSettingUsetProfileInfo(
        res[0]?.data?.filter(item => item.company_id === currentUser.portfolio_info[0].org_id)
        ?.filter(item => item.data_type === currentUser.portfolio_info[0].data_type)
      ); 

      const projectListing = res[1]?.data
      ?.filter(
        (project) =>
          project?.data_type === currentUser.portfolio_info[0].data_type &&
          project?.company_id === currentUser.portfolio_info[0].org_id &&
          project.project_list &&
          project.project_list.every(
            (listing) => typeof listing === "string"
          )
      ).reverse();

      setAllProjects(
        projectListing.length < 1  ? []
        :
        projectListing[0]?.project_list
      );

      setLoading(false); 
    }).catch(err => {
      console.log(err); 
      setLoading(false);
    })

    if (list?.length < 1) {
      getApplicationForAdmin(currentUser?.portfolio_info[0].org_id)
        .then(resp => {
          setlist(resp.data.response.data?.filter(j => currentUser.portfolio_info[0].data_type === j.data_type));
        })
        .catch(err => console.log(err))
    }
  }, [])

  const submit = () => {
    const { org_id, org_name, data_type, owner_name } = options1[0];
    const teamManagementProduct = currentUser.portfolio_info.find(item => item.product === teamManagementProductName);
    if (!teamManagementProduct) return
    setLoading(true);
    adminAddNewSettingProfile({
      company_id: teamManagementProduct.org_id,
      org_name: teamManagementProduct.org_name,
      owner: currentUser.userinfo.username,
      data_type: teamManagementProduct.data_type,
      profile_info: [
        { profile_title: firstSelection, Role: secondSelection, version: "1.0" }
      ]
    })
      .then(response => { console.log(response); setFirstSelection(""); setSecondSelection(""); setAlert(true); setLoading(false); })
      .catch(error => console.log(error))
  }
  const submit2 = () => {
    const { org_id, org_name, data_type, owner_name } = options1[0];
    const teamManagementProduct = currentUser.portfolio_info.find(item => item.product === teamManagementProductName);
    if (!teamManagementProduct) return
    setLoading(true);
    adminAddNewSettingProfile({
      company_id: teamManagementProduct.org_id,
      org_name: teamManagementProduct.org_name,
      owner: currentUser.userinfo.username,
      data_type: teamManagementProduct.data_type,
      profile_info: [
        { profile_title: firstSelection, Role: secondSelection, version: "1.0", project: Proj_Lead }
      ]
    })
      .then(response => { console.log(response); setFirstSelection(""); setSecondSelection(""); setAlert(true); setLoading(false); })
      .catch(error => console.log(error))
  }

  const handleNavSelectionClick = (selection) => {

    const currentIndexes = {...indexes};
    if (selection === 'forward') {
      if ((currentRoleFilter === 'yes') && (currentIndexes.end >= options1?.filter(user => settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name)).length)) return  
      if ((currentRoleFilter === 'no') && (currentIndexes.end >= options1?.filter(user => !settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name)).length)) return  
      if ((currentRoleFilter === 'hired') && (currentIndexes.end >= options1?.filter(user => hiredCandidates.includes(user.portfolio_name)).length)) return
      if (
        (currentRoleFilter === 'teamlead') && 
        (
          currentIndexes.end >= 
          options1?.filter(user => 
            settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name) && 
            settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name && value["profile_info"][value.profile_info.length - 1]["Role"] === rolesNamesDict.Teamlead)
          ).length
        )
      ) return
      if (
        (currentRoleFilter === 'grouplead') && 
        (
          currentIndexes.end >= 
          options1?.filter(user => 
            settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name) && 
            settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name && value["profile_info"][value.profile_info.length - 1]["Role"] === rolesNamesDict["Group Lead"])
          ).length
        )
      ) return

      if (currentIndexes.end >= options1?.length) return

      setIndexes({
        start: currentIndexes.start + rowsToDisplayPerPage,
        end: currentIndexes.end + rowsToDisplayPerPage,
      })
    }

    
    if (selection === 'backward') {
      if (currentIndexes.start < 1) return

      setIndexes({
        start: currentIndexes.start - rowsToDisplayPerPage,
        end: currentIndexes.end - rowsToDisplayPerPage,
      })
    }
  }
  console.log(usersToDisplay)
  return <StaffJobLandingLayout adminView={true} adminAlternativePageActive={true} pageTitle={"Settings"}>
    {(loading || loading2) ? <LoadingSpinner /> :
      <>
        {alert && <Alert />}
        <div className="table_team_roles">
          <div className="team__Settings__Header">
            <h2>Portfolio/Team roles</h2>
            <div className="team__Settings__NAv">
              <span>
                Showing {indexes.start + 1} to {indexes.end} out of {
                  currentRoleFilter === 'yes' ?
                    searchValue.length > 0 ?
                      options1?.filter(user => 
                        settingUserProfileInfo?.reverse()?.find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name)
                      )?.filter(item => item)?.filter(item => item.portfolio_name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                      ?.length
                    :
                    options1?.filter(user => settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name)).length
                  :
                  currentRoleFilter === 'no' ?
                    searchValue.length > 0 ?
                      options1?.filter(user => 
                        !settingUserProfileInfo?.reverse()?.find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name)
                      )?.filter(item => item)?.filter(item => item.portfolio_name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                      ?.length
                    :
                    options1?.filter(user => !settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name)).length
                  :
                  currentRoleFilter === 'hired' ?
                    searchValue.length > 0 ?
                      options1?.filter(user => 
                        hiredCandidates.includes(user.portfolio_name)
                      )?.filter(item => item.portfolio_name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                      ?.length
                    :
                    options1?.filter(user => hiredCandidates.includes(user.portfolio_name)).length
                  :
                  currentRoleFilter === 'teamlead' ?
                    searchValue.length > 0 ?
                      options1?.filter(user => 
                        settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name) && 
                        settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name && value["profile_info"][value.profile_info.length - 1]["Role"] === rolesNamesDict.Teamlead)
                      )?.filter(item => item)?.filter(item => item.portfolio_name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                      ?.length
                    :
                    options1?.filter(user => 
                      settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name) && 
                      settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name && value["profile_info"][value.profile_info.length - 1]["Role"] === rolesNamesDict.Teamlead)
                    ).length
                  :
                  currentRoleFilter === 'grouplead' ?
                    searchValue.length > 0 ?
                      options1?.filter(user => 
                        settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name) && 
                        settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name && value["profile_info"][value.profile_info.length - 1]["Role"] === rolesNamesDict["Group Lead"])
                      )?.filter(item => item)?.filter(item => item.portfolio_name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                      ?.length
                    :
                    options1?.filter(user => 
                      settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name) && 
                      settingUserProfileInfo.reverse().find(value => value["profile_info"][value.profile_info.length - 1]["profile_title"] === user.portfolio_name && value["profile_info"][value.profile_info.length - 1]["Role"] === rolesNamesDict["Group Lead"])
                    ).length
                  :
                  searchValue.length > 0 ?
                      options1?.filter(user => user.portfolio_name?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))?.length
                    :
                  options1?.length
                }
              </span>
              <div className="team__Nav__Btns__Wrapper">
                {
                  indexes.start > 0 && <button
                    onClick={() => handleNavSelectionClick('backward')}
                  >
                    <MdArrowBackIos />
                  </button>
                }
                {
                  indexes.end < options1?.length &&
                  <button
                    onClick={() => handleNavSelectionClick('forward')}
                  >
                    <MdOutlineArrowForwardIos />
                  </button>
                }
              </div>
            </div>
          </div>
          
          <div className="role__Filter__Item">
            <div className="role__Filter__Search">
              <AiOutlineSearch />
              <input 
                value={searchValue}
                onChange={({ target }) => setSearchValue(target.value)}
                type="text"
                placeholder="Search for portfolio name"
              />
            </div>
            <div className="role__Filter__Wrapper" onClick={() => roleFilterRef.current.click()}>
              <IoFilterOutline />
              <select ref={roleFilterRef} className="role__Filter" value={currentRoleFilter} onChange={({ target }) => setCurrentRoleFilter(target.value)}>
                <option value={'all'}>All</option>
                <option value={'yes'}>Role assigned</option>
                <option value={'no'}>No role assigned</option>
                <option value={'hired'}>Hired</option>
                <option value={'teamlead'}>Teamlead</option>
                <option value={'grouplead'}>Grouplead</option>
              </select>
            </div>
          </div>

          <div className="show__Row__Filter">
            <p>
              <span>Showing</span>
              <select 
                className="role__Filter" 
                value={rowsToDisplayPerPage} 
                onChange={({ target }) => {
                  const currentIndexes = {...indexes}
                  currentIndexes.end = Number(target.value);
                  setIndexes(currentIndexes);

                  setRowsToDisplayPerPage(Number(target.value));
                  }
                }
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span>rows</span>
            </p>
          </div>

          <div className="table__Wrapper">
            <table>
              <thead>
              <tr>
                    <th>S/N</th>
                    <th>Member portfolio name</th>
                    <th>Role Assigned</th>
                    <th>Additional Roles Assigned</th>
                    <th>Candidate Hired</th>
                    <th>Project Assigned</th>
                    <th>Additional Projects Assigned</th>
                    <th>Update role</th>
                  </tr>
              </thead>
              <tbody>
                {usersToDisplay?.map((option, index) => (
                    <TableRow
                      index={index}
                      key={index}
                      option={option}
                      settingUserProfileInfo={settingUserProfileInfo}
                      rolesDict={rolesDict}
                      currentUser={currentUser}
                      Proj_Lead={Proj_Lead}
                      setAlert={setAlert}
                      setLoading={setLoading}
                      projectList={options2}
                      hiredCandidates={hiredCandidates}
                      currentFilter={currentRoleFilter}
                      setTeamleadProject={setProj_Lead}
                      availableProjects={allProjects}
                      updateSettingsUserProfileInfo={setSettingUsetProfileInfo}
                      updatedUsers={usersToDisplay}
                      rolesNamesDict={rolesNamesDict}
                      currentSearch={searchValue}
                    />
                  ))}

              </tbody>
            </table>
          </div>
        </div>
{/* 
        <div className="Slections">
          <h2>Assign Roles & Rights to Portfolios & Teams</h2>

          <div>
            <label>
              <p>Select User Portfolio <span>* </span> :</p>
              <select value={firstSelection} onChange={handleFirstSelectionChange} >
                <option disabled value="">Select an option</option>
                {options1?.filter(option => hiredCandidates.includes(option.portfolio_name)).map(option => <option key={option.org_id} value={option.portfolio_name}>{option.portfolio_name}</option>)}
              </select>
            </label>
            {(userstatus?.length > 0 && firstSelection.length > 0) && <p style={{ marginTop: "4%" }}>Current application status:{userstatus}</p>}
          </div>
          <div>

            {(showSecondSelection && firstSelection.length > 0) && (userstatus === "hired" &&
              <label>
                <p>Select Role <span> * </span> :</p>
                <select
                  value={secondSelection}
                  onChange={handleSecondSelectionChange}
                >
                  <option disabled value="">Select an option</option>
                  {Object.keys(options2).map(key => <option key={key} value={key}>{options2[key]}</option>)}
                </select>
              </label>

            )}
          </div>
          <div>
            {
              (secondSelection === "Proj_Lead" && firstSelection.length > 0) && (
                <label>
                  <p>Select Project <span> * </span> :</p>
                  <select value={Proj_Lead} onChange={e => setProj_Lead(e.target.value)}>
                    <option disabled value="">select a project</option>
                    {projectList.map((p, i) => <option value={p} key={i}>{p}</option>)}
                  </select>
                </label>

              )
            }
          </div>

          {(firstSelection && secondSelection) && <button onClick={firstSelection && secondSelection !== "Proj_Lead" ? submit : submit2} style={{ position: "relative", marginTop: 10 }}>{loading ? <LoadingSpinner
            color="#fff"
            width={24}
            height={24}
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          /> : "Submit"}</button>}
        </div> */}

      </>
    }

  </StaffJobLandingLayout>
}


const projectList = [
  "Workflow AI",
  "Data Analyst",
  "Global functions",
  "Organiser",
  "Hr Hiring",
  "Law Intern",
  "NPS Live",
  "Voice of Consumer",
  "Login",
  "Business development",
  "QR code generation",
  "Social Media Automation",
  "Online shops",
  "License compatibility",
  "Live UX Dashboard",
  "HR Intern",
  "Sale Agent",
  "Sales Coordinator"
]

export default AdminSettings;