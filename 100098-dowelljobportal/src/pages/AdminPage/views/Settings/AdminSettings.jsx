import { useState } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"
import axios from 'axios' ; 
import './index.scss'
const AdminSettings = () => {
    const {currentUser} = useCurrentUserContext() ; 
  
    const [firstSelection, setFirstSelection] = useState("");
    const [secondSelection, setSecondSelection] = useState("");
    const [data ,setData] = useState("") ; 
    console.log("DATA",data) ;
    const [showSecondSelection, setShowSecondSelection] = useState(false);
    const [options1 , setOptions1] = useState(currentUser?.selected_product.userportfolio) ; 
    const [options2 , setOptions2] = useState(["Dept_Lead" ,"Hr" ,"Proj_Lead" ,"Candidate" ]) ; 
    console.log("options1".toUpperCase(),options1) ; 
    console.log("currentUser",currentUser) ; 
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
      console.log("AAAAAAAAAAAAAAAA",{org_id , org_name ,data_type , owner_name } )
    axios.post('https://100098.pythonanywhere.com/setting/SettingUserProfileInfo/', {
      company_id:org_id,
      org_name: org_name,
      owner:owner_name,
      data_type:data_type,
      profile_info: [
        { profile_title: firstSelection, Role: secondSelection, version: "1.0" }
      ]},[])
        .then(response => { console.log(response)})
        .catch(error => console.log(error))
      }
    return <StaffJobLandingLayout adminView={true} adminAlternativePageActive={true} pageTitle={"Settings"}>
        <div className="Slections">
      <div>
      <label>
        <p>First Selection <span>* </span> :</p>
        <select value={firstSelection} onChange={handleFirstSelectionChange} >
          <option value="">Select an option</option>
        {options1.map(option => option.member_type !== "owner" ? <option onSelect={()=>{setSelectedUser(option)}}  key={option.org_id} value={option.portfolio_name}>{option.portfolio_name}</option> : null)}
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
            {options2.map(value => <option onSelect={()=>{setSelectedRole(value)}} key={value} value={value}>{value}</option>)}
          </select>
        </label>
        
      )}
      </div>
    {(firstSelection && secondSelection) && <button onClick={submit}>submit</button>}
    </div>
    </StaffJobLandingLayout>
}

export default AdminSettings;
