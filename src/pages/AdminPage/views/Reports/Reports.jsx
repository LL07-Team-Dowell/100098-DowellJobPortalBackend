import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"

const AdminReports = ({subAdminView}) => {
    // states
    const [selectOptions, setSelectOptions] = React.useState('') ; 

    // handle functions 
    const handleSelectOptionsFunction = (e) => {
        setSelectOptions(e.target.value)
    }
    return <StaffJobLandingLayout adminView={true} adminAlternativePageActive={true} pageTitle={"Reports"} subAdminView={subAdminView}>
           <div className="reports__container">
            <h3>Reports</h3>
            <p>Get insights into your organizations</p>
            <select onChange={handleSelectOptionsFunction}>
                <option value="select_time">select time</option>
                <option value="last_7_days">last 7 days</option>
                <option value="custom_time">cutom time</option>
            </select>
           </div>
    </StaffJobLandingLayout>
}

export default AdminReports;