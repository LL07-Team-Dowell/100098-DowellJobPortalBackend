import { useState , useEffect } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"
import axios from 'axios' ; 
import './index.scss'
import Alert from "./component/Alert";
import { getUserInfoFromLoginAPI } from "../../../../services/authServices";
const AdminSettings = () => {
    const {currentUser, setCurrentUser} = useCurrentUserContext() ; 
    const [firstSelection, setFirstSelection] = useState("");
    const [secondSelection, setSecondSelection] = useState("");
    const [data ,setData] = useState("") ; 
    const [showSecondSelection, setShowSecondSelection] = useState(false);
    const [options1 , setOptions1] = useState(currentUser?.userportfolio.filter(member => member.member_type !== "owner")) ; 
    const [options2 , setOptions2] = useState(["Dept_Lead" ,"Hr" ,"Proj_Lead" ,"Candidate" ]) ; 
    const [alert , setAlert] = useState(false) ; 

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
  
  const submit = () => {
      const {org_id , org_name ,data_type , owner_name } = options1[0] ; 
      const teamManagementProduct = currentUser.portfolio_info.find(item => item.product === "Team Management");
      if (!teamManagementProduct) return

    axios.post('https://100098.pythonanywhere.com/setting/SettingUserProfileInfo/', {
      company_id: teamManagementProduct.org_id,
      org_name: teamManagementProduct.org_name,
      owner: currentUser.userinfo.username,
      data_type:teamManagementProduct.data_type,
      profile_info: [
        { profile_title: firstSelection, Role: secondSelection, version: "1.0" }
      ]},[])
        .then(response => { console.log(response) ;setFirstSelection("") ;setSecondSelection("") ;setAlert(true)})
        .catch(error => console.log(error))
      }
    return <StaffJobLandingLayout adminView={true} adminAlternativePageActive={true} pageTitle={"Settings"}>
          {alert &&   <Alert/> }

        <div className="Slections">
      
      <div>
      <label>
        <p>First Selection <span>* </span> :</p>
        <select value={firstSelection} onChange={handleFirstSelectionChange} >
          <option value="">Select an option</option>
        {options1.map(option => <option   key={option.org_id} value={option.portfolio_name}>{option.portfolio_name}</option> )}
        </select>
      </label>
      </div>
      <div>

      {showSecondSelection && (
        <label>
          <p>Second Selection <span>* </span> :</p>
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
    {(firstSelection && secondSelection) && <button onClick={submit}>submit</button>}
    </div>
    </StaffJobLandingLayout>
}

export default AdminSettings;
