import { useState } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"

const AdminSettings = () => {
    const {currentUser} = useCurrentUserContext() ; 
  
    const [firstSelection, setFirstSelection] = useState("");
    const [secondSelection, setSecondSelection] = useState("");
    const [showSecondSelection, setShowSecondSelection] = useState(false);
    console.log(currentUser.selected_product) ;
    const [options1 , setOptions1] = useState(currentUser.selected_product.userportfolio) ; 
    console.log("options1",options1)
    const [options2 , setOptions2] = useState(["Dept_Lead" ,"Hr" ,"Proj_Lead" ,"Candidate" ]) ; 

    const handleFirstSelectionChange = (event) => {
    const selection = event.target.value;
    setFirstSelection(selection);
      setShowSecondSelection(true);
  };

  const handleSecondSelectionChange = (event) => {
    setSecondSelection(event.target.value);
  };
  
  const submit = () => {
    axios.post('https://100098.pythonanywhere.com/setting/SettingUserProfileInfo/', {
        company_id: '100098' , org_name},[])
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
    <button >submit</button>
    </StaffJobLandingLayout>
}

export default AdminSettings;
