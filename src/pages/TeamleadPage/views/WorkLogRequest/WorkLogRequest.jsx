import {useState} from "react";
import { NavLink } from "react-router-dom";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import Navbar from "../CreateMembersTask/component/Navbar";
import { Wrappen } from "../../../CandidatePage/views/TeamScreenThread/style";

const WorkLogRequest = () => {

  const [status, setStatus] = useState("Pending approval");
  return (
    <StaffJobLandingLayout teamleadView={true}>
      <Navbar
        title={"Work Log Request"}
        color={"#005734"}
        noButtonBack={true}
        removeButton={true}
      />
      <div className="container">
        <Wrappen>
          <NavLink
            className={status === "Pending approval" && "isActive"}
            to={`/request`}
            onClick={() => setStatus("Pending approval")}
          >
            Pending Approval
          </NavLink>
          <NavLink
            className={status === "Approved" && "isActive"}
            to={`/request`}
            onClick={() => setStatus("Approved")}
          >
            Approval
          </NavLink>
          <NavLink
            className={status === "Denied" && "isActive"}
            to={`/request`}
            onClick={() => setStatus("Denied")}
          >
            Denied
          </NavLink>
        </Wrappen>
      </div>
    </StaffJobLandingLayout>
  );
};

export default WorkLogRequest;
