import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import "./style.css";


const AdminUserScreen = ({subAdminView}) => {
    const navigate = useNavigate();
    const { currentUser } = useCurrentUserContext()
    const handleLogout = () => navigate("/logout");

    return <>
        <StaffJobLandingLayout adminView={true} handleNavIconClick={() => navigate("/add-job")} adminAlternativePageActive={true} pageTitle={"User"} subAdminView={subAdminView}>
        <div className="user__Page__Container admin">

            <div className="user__Intro__Item__Container">
                <div className="user__Intro__Item">
                    <h2>User Name</h2>
                    <span>{ currentUser?.userinfo.username }</span>    
                </div>
                <div className="edit__Btn">
                    Edit
                </div>
            </div>
            <div className="user__Intro__Item">
                <h2>Email</h2>
                <span>{currentUser?.userinfo.email}</span>
            </div>
            <div className="user__Intro__Item">
                <h2>First Name</h2>
                <span>{currentUser?.first_name}</span>
            </div>
            {
                currentUser?.last_name !== "" &&
                <div className="user__Intro__Item">
                    <h2>Last Name</h2>
                    <span>{currentUser?.last_name}</span>
                </div>
            }
            <div className="user__Intro__Item">
                <h2>Role</h2>
                <span>Admin</span>
            </div>
            <button className="logout__Btn" onClick={handleLogout}>
                Logout
            </button>  
        </div>
        </StaffJobLandingLayout>
    </>
}

export default AdminUserScreen;
