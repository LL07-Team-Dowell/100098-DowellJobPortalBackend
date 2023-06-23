import { useState, useEffect } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"
import axios from 'axios';
import './index.scss'
import Alert from "./component/Alert";
import { getUserInfoFromLoginAPI } from "../../../../services/authServices";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { getSettingUserProfileInfo } from "../../../../services/settingServices";
import { useJobContext } from "../../../../contexts/Jobs";
import { getApplicationForAdmin } from "../../../../services/adminServices";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";

const rolesDict = { 'Dept_Lead': 'Account', "Proj_Lead": 'Teamlead', "Hr": "Hr", "sub_admin": "Sub Admin", "group_lead": "Group Lead" };

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


  useEffect(() => {
    if (firstSelection.length > 0) {
      const status = list.reverse().find(p => p.portfolio_name === firstSelection)?.status;
      const selectedPortfolioIsOwner = currentUser?.userportfolio?.find(user => user.portfolio_name === firstSelection && user.role === 'owner');

      if (selectedPortfolioIsOwner) return setuserstatus(candidateStatuses.ONBOARDING);
      if (!status) return setuserstatus('');
      setuserstatus(status);
    }
  }, [firstSelection])
  console.log({ loading, loading2 })
  useEffect(() => {

    // User portfolio has already being loaded
    if (currentUser.userportfolio.length > 0) return setLoading2(false)

    const currentSessionId = sessionStorage.getItem("session_id");

    if (!currentSessionId) return setLoading2(false)
    const teamManagementProduct = currentUser?.portfolio_info.find(item => item.product === "Team Management");
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
  const handleFirstSelectionChange = (event) => {
    const selection = event.target.value;
    setData(options1.find(option => option.portfolio_name === selection))
    setFirstSelection(selection);
    setShowSecondSelection(true);
  };

  const handleSecondSelectionChange = (event) => {
    setSecondSelection(event.target.value);
  };
  // useEffect(() => {
  //   setLoading(true);
  //   getSettingUserProfileInfo().then(resp => { setSettingUsetProfileInfo(resp.data); setLoading(false); console.log(resp.data.reverse()) }).catch(err => { console.log(err); setLoading(false) })
  //   if (list.length < 1) {
  //     getApplicationForAdmin(currentUser?.portfolio_info[0].org_id)
  //       .then(resp => {
  //         setlist(resp.data.response.data?.filter(j => currentUser.portfolio_info[0].data_type === j.data_type));
  //       })
  //       .catch(err => console.log(err))
  //   }
  // }, [])
  
  const submit = () => {
    const { org_id, org_name, data_type, owner_name } = options1[0];
    const teamManagementProduct = currentUser.portfolio_info.find(item => item.product === "Team Management");
    if (!teamManagementProduct) return
    setLoading(true);
    axios.post('https://100098.pythonanywhere.com/setting/SettingUserProfileInfo/', {
      company_id: teamManagementProduct.org_id,
      org_name: teamManagementProduct.org_name,
      owner: currentUser.userinfo.username,
      data_type: teamManagementProduct.data_type,
      profile_info: [
        { profile_title: firstSelection, Role: secondSelection, version: "1.0" }
      ]
    }, [])
      .then(response => { console.log(response); setFirstSelection(""); setSecondSelection(""); setAlert(true); setLoading(false); })
      .catch(error => console.log(error))
  }
  const submit2 = () => {
    const { org_id, org_name, data_type, owner_name } = options1[0];
    const teamManagementProduct = currentUser.portfolio_info.find(item => item.product === "Team Management");
    if (!teamManagementProduct) return
    setLoading(true);
    axios.post('https://100098.pythonanywhere.com/setting/SettingUserProfileInfo/', {
      company_id: teamManagementProduct.org_id,
      org_name: teamManagementProduct.org_name,
      owner: currentUser.userinfo.username,
      data_type: teamManagementProduct.data_type,
      profile_info: [
        { profile_title: firstSelection, Role: secondSelection, version: "1.0", project: Proj_Lead }
      ]
    }, [])
      .then(response => { console.log(response); setFirstSelection(""); setSecondSelection(""); setAlert(true); setLoading(false); })
      .catch(error => console.log(error))
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
  return <StaffJobLandingLayout adminView={true} adminAlternativePageActive={true} pageTitle={"Settings"}>
    {(loading || loading2) ? <LoadingSpinner /> :
      <>
        {alert && <Alert />}
        <div className="table_team_roles">
          <h2>Portfolio/Team roles</h2>

          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Member portfolio name</th>
                <th>Role Assigned</th>
              </tr>
            </thead>
            <tbody>
              {options1.map((option, index) =>
                <tr key={index}> <td>{index + 1}</td>
                  <td>{option.portfolio_name}</td>
                  <td>{settingUserProfileInfo.reverse().find(value => value["profile_info"][0]["profile_title"] === option.portfolio_name)
                    ? rolesDict[settingUserProfileInfo.reverse().find(value => value["profile_info"][0]["profile_title"] === option.portfolio_name)["profile_info"][0]["Role"]] ?
                      rolesDict[settingUserProfileInfo.reverse().find(value => value["profile_info"][0]["profile_title"] === option.portfolio_name)["profile_info"][0]["Role"]] :
                      "No Role assigned yet"
                    : "No Role assigned yet"}</td>
                </tr>)}

            </tbody>
          </table>
        </div>

        <div className="Slections">
          <h2>Assign Roles & Rights to Portfolios & Teams</h2>

          <div>
            <label>
              <p>Select User Portfolio <span>* </span> :</p>
              <select value={firstSelection} onChange={handleFirstSelectionChange} >
                <option disabled value="">Select an option</option>
                {options1.map(option => <option key={option.org_id} value={option.portfolio_name}>{option.portfolio_name}</option>)}
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
        </div>

      </>
    }

  </StaffJobLandingLayout>
}

export default AdminSettings;
