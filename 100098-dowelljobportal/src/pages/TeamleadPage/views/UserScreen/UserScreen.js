import "./style.css";


const UserScreen = ({ currentUser }) => {
    return <>
        <div className="user__Page__Container teamlead">

            <div className="user__Intro__Item__Container">
                <div className="user__Intro__Item">
                    <h2>User Name</h2>
                    <span>{ currentUser.username }</span>    
                </div>
                <div className="edit__Btn">
                    Edit
                </div>
            </div>
            <div className="user__Intro__Item">
                <h2>Email</h2>
                <span>{currentUser.email}</span>
            </div>
            <div className="user__Intro__Item">
                <h2>First Name</h2>
                <span>{currentUser.first_name}</span>
            </div>
            {
                currentUser.last_name !== "" &&
                <div className="user__Intro__Item">
                    <h2>Last Name</h2>
                    <span>{currentUser.last_name}</span>
                </div>
            }
            <div className="user__Intro__Item">
                <h2>Role</h2>
                <span>{currentUser.role}</span>
            </div>
            
        </div>
    </>
}

export default UserScreen;
