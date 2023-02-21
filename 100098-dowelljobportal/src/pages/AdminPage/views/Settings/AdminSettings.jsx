import { useState } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"
import axios from 'axios' ; 
const AdminSettings = () => {
    const {currentUser} = useCurrentUserContext() ; 
  
    const [firstSelection, setFirstSelection] = useState("");
    const [secondSelection, setSecondSelection] = useState("");
    const [data ,setData] = useState("") ; 
    const [showSecondSelection, setShowSecondSelection] = useState(false);
    const [options1 , setOptions1] = useState(currentUser.selected_product.userportfolio) ; 
    const [options2 , setOptions2] = useState(["Dept_Lead" ,"Hr" ,"Proj_Lead" ,"Candidate" ]) ; 

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
    const {data_type , member_type , operations_right , org_id , org_name , owner_name , portfolio_code , portfolio_details , portfolio_name ,portfolio_specification , portfolio_uni_code , product , role , security_layer , status} = data ; 
    console.log("WOOOOOOOOOOOOOO") ;
    axios.post('https://100098.pythonanywhere.com/setting/SettingUserProfileInfo/', {
      company_id:org_id,
      org_name: org_name,
      owner:owner_name,
      data_type:data_type,
      profile_info: [
        { profile_title: "portfolio_name", Role: role, version: "1.0" }
      ]},[])
        .then(response => { console.log(response)})
        .catch(error => console.log(error))
      }
    return <StaffJobLandingLayout adminView={true} adminAlternativePageActive={true} pageTitle={"Settings"}>
        <div>
      <label>
        First Selection:
        <select value={firstSelection} onChange={handleFirstSelectionChange} >
          <option value="">Select an option</option>
        {options1.map(option => option.member_type !== "owner" ? <option onSelect={()=>{setSelectedUser(option)}}  key={option.org_id} value={option.portfolio_name}>{option.portfolio_name}</option> : null)}
        </select>
      </label>
      {showSecondSelection && (
        <label>
          Second Selection:
          <select
            value={secondSelection}
            onChange={handleSecondSelectionChange}
          >
            <option value="">Select an option</option>
            {options2.map(value => <option onSelect={()=>{setSelectedRole(value)}}  value={value}>{value}</option>)}
          </select>
        </label>
      )}
    </div>
    <button onClick={submit}>submit</button>
    </StaffJobLandingLayout>
}

export default AdminSettings;
