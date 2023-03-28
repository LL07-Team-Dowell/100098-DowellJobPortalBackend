import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"

const AdminReports = () => {
    return <StaffJobLandingLayout adminView={true} adminAlternativePageActive={true} pageTitle={"Reports"}>
            <div style={{
                display:"flex" , alignContent:"center", justifyContent:"center"
            }}>
                <h4>Coming Soon..</h4>
            </div>
    </StaffJobLandingLayout>
}

export default AdminReports;