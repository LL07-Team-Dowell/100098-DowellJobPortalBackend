import { Link } from "react-router-dom"
import { useCurrentUserContext } from "./contexts/CurrentUserContext";

const IntermediatePage = () => {

    const { currentUser, setCurrentUser } = useCurrentUserContext();
    
    const handleSetView = (e, valuePassed) => {
        e.preventDefault()

        const initialUserObj = {
            username: "testing user",
        }

        switch (valuePassed) {
            case "admin":
                console.log({ ...currentUser, role: testingRoles.adminRole })
                if (currentUser) return setCurrentUser({ ...currentUser, role: testingRoles.adminRole })
                setCurrentUser({...initialUserObj, role: testingRoles.adminRole })
                break;
            case "account":
                if (currentUser) return setCurrentUser({ ...currentUser, role: testingRoles.accountRole })
                setCurrentUser({...initialUserObj, role: testingRoles.accountRole })
                break;
            case "candidate":
                if (currentUser) return setCurrentUser({ ...currentUser, role: testingRoles.candidateRole })
                setCurrentUser({...initialUserObj, role: testingRoles.candidateRole })
                break;
            case "hr":
                if (currentUser) return setCurrentUser({ ...currentUser, role: testingRoles.hrRole })
                setCurrentUser({...initialUserObj, role: testingRoles.hrRole })
                break;
            case "teamlead":
                if (currentUser) return setCurrentUser({ ...currentUser, role: testingRoles.teamLeadRole })
                setCurrentUser({...initialUserObj, role: testingRoles.teamLeadRole })
                break;
            default:
                break;
        }
    }

    return <div style={{ paddingTop: "5%", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "column", gap: "2rem"}}>
        <h1>Select a view</h1>
        
        <Link to={"#"} onClick={(e) => handleSetView(e, "admin")}>Admin view</Link>
        <Link to={"#"} onClick={(e) => handleSetView(e, "account")}>Account view</Link>
        <Link to={"#"} onClick={(e) => handleSetView(e, "candidate")}>Candidate view</Link>
        <Link to={"#"} onClick={(e) => handleSetView(e, "hr")}>Hr view</Link>
        <Link to={"#"} onClick={(e) => handleSetView(e, "teamlead")}>Teamlead view</Link>
    </div>
}

export const testingRoles = {
    accountRole: "Dept_Lead",
    adminRole: "Admin",
    hrRole: "Hr",
    teamLeadRole: "Proj_Lead",
    candidateRole: "Candidate",
}

export default IntermediatePage;