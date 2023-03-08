import { useState , useEffect } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"
import axios from 'axios' ; 
import './index.scss'
import Alert from "./component/Alert";
import { getUserInfoFromLoginAPI } from "../../../../services/authServices";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { getSettingUserProfileInfo } from "../../../../services/settingServices"; 
const AdminSettings = () => {
    const {currentUser, setCurrentUser} = useCurrentUserContext() ; 
    const [firstSelection, setFirstSelection] = useState("");
    const [secondSelection, setSecondSelection] = useState("");
    const [data ,setData] = useState("") ; 
    const [showSecondSelection, setShowSecondSelection] = useState(false);
    const [options1 , setOptions1] = useState(currentUser?.userportfolio.filter(member => member.member_type !== "owner")) ; 
    const [options2 , setOptions2] = useState(["Dept_Lead" ,"Hr" ,"Proj_Lead" ,"Candidate" ]) ; 
    const [alert , setAlert] = useState(false) ; 
    const [loading , setLoading] = useState(false) ;
    const [settingUserProfileInfo ,setSettingUsetProfileInfo] = useState([]) ; 
    const [loading2 , setLoading2] = useState(true) ; 
    console.log({loading , loading2})
    useEffect(() => {

      // User portfolio has already being loaded
      if (currentUser.userportfolio.length > 0) return

      const currentSessionId = sessionStorage.getItem("session_id");

      if (!currentSessionId) return
      const teamManagementProduct = currentUser?.portfolio_info.find(item => item.product === "Team Management");
      if (!teamManagementProduct) return

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
      setOptions1(currentUser?.userportfolio.filter(member => member.member_type !== "owner"))
    }, [currentUser])

    useEffect(()=>{
      if(alert){
        setTimeout(()=>{
          setAlert(false)
        },2500)
      }
    },[alert])
    const handleFirstSelectionChange = (event) => {
    const selection = event.target.value;
    setData(options1.find(option => option.portfolio_name === selection))
    setFirstSelection(selection);
      setShowSecondSelection(true);
  };

  const handleSecondSelectionChange = (event) => {
    setSecondSelection(event.target.value);
  };
  useEffect(()=>{
    setLoading(true) ; 
    getSettingUserProfileInfo().then(resp => {setSettingUsetProfileInfo(resp.data); setLoading(false);console.log(resp.data.reverse())}).catch(err => {console.log(err) ; setLoading(false)})
  },[])
  const submit = () => {
      const {org_id , org_name ,data_type , owner_name } = options1[0] ; 
      const teamManagementProduct = currentUser.portfolio_info.find(item => item.product === "Team Management");
      if (!teamManagementProduct) return
    setLoading(true) ;
    axios.post('https://100098.pythonanywhere.com/setting/SettingUserProfileInfo/', {
      company_id: teamManagementProduct.org_id,
      org_name: teamManagementProduct.org_name,
      owner: currentUser.userinfo.username,
      data_type:teamManagementProduct.data_type,
      profile_info: [
        { profile_title: firstSelection, Role: secondSelection, version: "1.0" }
      ]},[])
        .then(response => { console.log(response) ;setFirstSelection("") ;setSecondSelection("") ;setAlert(true) ; setLoading(false) ;})
        .catch(error => console.log(error))
      }

    return <StaffJobLandingLayout adminView={true} adminAlternativePageActive={true} pageTitle={"Settings"}>
          {(loading || loading2) ? <LoadingSpinner/> : 
          <>
          {alert &&   <Alert/> }
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
        {options1.map((option , index) => 
        <tr key={index}> <td>{index + 1 }</td>
        <td>{option.portfolio_name}</td>
        <td>{settingUserProfileInfo.reverse().find(value => value["profile_info"][0]["profile_title"] ===option.portfolio_name) 
        ?  settingUserProfileInfo.reverse().find(value => value["profile_info"][0]["profile_title"] ===option.portfolio_name)["profile_info"][0]["Role"] 
        : "No Role assigned yet" }</td>
        </tr>)}
         
        </tbody>
        </table>
          </div>
  
          <div className="Slections">
          <h2>Assign Roles & Rights to Portfolios & Teams</h2>

        <div>
        <label>
          <p>Select User <span>* </span> :</p>
          <select value={firstSelection} onChange={handleFirstSelectionChange} >
            <option value="">Select an option</option>
          {options1.map(option => <option   key={option.org_id} value={option.portfolio_name}>{option.portfolio_name}</option> )}
          </select>
        </label>
        </div>
        <div>
  
        {showSecondSelection && (
          <label>
            <p>Select Role <span> * </span> :</p>
            <select
              value={secondSelection}
              onChange={handleSecondSelectionChange}
            >
              <option value="">Select an option</option>
              {options2.map(value => <option  key={value} value={value}>{value}</option>)}
            </select>
          </label>
          
        )}
        </div>
      {(firstSelection && secondSelection) && <button  onClick={submit}  style={{ position: "relative" }}>{loading ?  <LoadingSpinner
        color="#fff"
        width={24}
        height={24}
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      /> :"submit"}</button>}
      </div>
          
      </>
          }
       
    </StaffJobLandingLayout>
}

export default AdminSettings;
