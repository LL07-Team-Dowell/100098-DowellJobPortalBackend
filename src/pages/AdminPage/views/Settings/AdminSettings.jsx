import { useState, useEffect } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import axios from "axios";
import "./index.scss";
import Alert from "./component/Alert";
import { getUserInfoFromLoginAPI } from "../../../../services/authServices";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import {
  getSettingUserProfileInfo,
  configureSettingUserProfileInfo,
} from "../../../../services/settingServices";
import { useJobContext } from "../../../../contexts/Jobs";
import { getApplicationForAdmin } from "../../../../services/adminServices";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import { testingRoles } from "../../../../utils/testingRoles";
import TableRow from "./TableRow";

const rolesDict = {
  Dept_Lead: "Account",
  Proj_Lead: "Teamlead",
  Hr: "Hr",
  sub_admin: "Sub Admin",
  group_lead: "Group Lead",
  super_admin: "Super Admin",
};

const AdminSettings = () => {
  const { currentUser, setCurrentUser } = useCurrentUserContext();
  console.log({ CURRENTUSER: currentUser });
  const [firstSelection, setFirstSelection] = useState("");
  const [secondSelection, setSecondSelection] = useState("");
  const [data, setData] = useState("");
  const [showSecondSelection, setShowSecondSelection] = useState(false);
  const [options1, setOptions1] = useState(
    currentUser?.userportfolio?.filter(
      (member) => member.member_type !== "owner"
    )
  );
  const [options2, setOptions2] = useState(rolesDict);
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settingUserProfileInfo, setSettingUsetProfileInfo] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [userstatus, setuserstatus] = useState("");
  const [Proj_Lead, setProj_Lead] = useState("");
  const { list, setlist } = useJobContext();

  useEffect(() => {
    if (firstSelection.length > 0) {
      const status = list
        .reverse()
        .find((p) => p.portfolio_name === firstSelection)?.status;
      const selectedPortfolioIsOwner = currentUser?.userportfolio?.find(
        (user) =>
          user.portfolio_name === firstSelection && user.role === "owner"
      );

      if (selectedPortfolioIsOwner)
        return setuserstatus(candidateStatuses.ONBOARDING);
      if (!status) return setuserstatus("");
      setuserstatus(status);
    }
  }, [firstSelection]);
  console.log({ loading, loading2 });

  useEffect(() => {
    if (
      (currentUser.settings_for_profile_info &&
        currentUser.settings_for_profile_info.profile_info[0].Role ===
          testingRoles.superAdminRole) ||
      currentUser.isSuperAdmin
    )
      return setLoading2(false);

    // User portfolio has already being loaded
    if (currentUser?.userportfolio?.length > 0) return setLoading2(false);

    const currentSessionId = sessionStorage.getItem("session_id");

    if (!currentSessionId) return setLoading2(false);
    const teamManagementProduct = currentUser?.portfolio_info.find(
      (item) => item.product === "Team Management"
    );
    if (!teamManagementProduct) return setLoading2(false);

    const dataToPost = {
      session_id: currentSessionId,
      product: teamManagementProduct.product,
    };
    getUserInfoFromLoginAPI(dataToPost)
      .then((res) => {
        setCurrentUser(res.data);
        setLoading2(false);
      })
      .catch((err) => {
        console.log("Failed to get user details from login API");
        console.log(err.response ? err.response.data : err.message);
      });
  }, []);

  useEffect(() => {
    setOptions1(
      currentUser?.userportfolio?.filter(
        (member) => member.member_type !== "owner"
      )
    );
  }, [currentUser]);

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(false);
      }, 2500);
    }
  }, [alert]);
  const handleFirstSelectionChange = (event) => {
    const selection = event.target.value;
    setData(options1.find((option) => option.portfolio_name === selection));
    setFirstSelection(selection);
    setShowSecondSelection(true);
  };

  const handleSecondSelectionChange = (event) => {
    setSecondSelection(event.target.value);
  };
  useEffect(() => {
    setLoading(true);
    getSettingUserProfileInfo()
      .then((resp) => {
        setSettingUsetProfileInfo(resp.data);
        setLoading(false);
        console.log(resp.data.reverse());
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    if (list.length < 1) {
      getApplicationForAdmin(currentUser?.portfolio_info[0].org_id)
        .then((resp) => {
          setlist(
            resp.data.response.data?.filter(
              (j) => currentUser.portfolio_info[0].data_type === j.data_type
            )
          );
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const submit = () => {
    const { org_id, org_name, data_type, owner_name } = options1[0];
    const teamManagementProduct = currentUser.portfolio_info.find(
      (item) => item.product === "Team Management"
    );
    if (!teamManagementProduct) return;
    setLoading(true);
    axios
      .post(
        "https://100098.pythonanywhere.com/settinguserprofileinfo/",
        {
          company_id: teamManagementProduct.org_id,
          org_name: teamManagementProduct.org_name,
          owner: currentUser.userinfo.username,
          data_type: teamManagementProduct.data_type,
          profile_info: [
            {
              profile_title: firstSelection,
              Role: secondSelection,
              version: "1.0",
            },
          ],
        },
        []
      )
      .then((response) => {
        console.log(response);
        setFirstSelection("");
        setSecondSelection("");
        setAlert(true);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  const submit2 = () => {
    const teamManagementProduct = currentUser.portfolio_info.find(
      (item) => item.product === "Team Management"
    );
    if (!teamManagementProduct) return;
    setLoading(true);
    axios
      .post(
        "https://100098.pythonanywhere.com/settinguserprofileinfo/",
        {
          company_id: teamManagementProduct.org_id,
          org_name: teamManagementProduct.org_name,
          owner: currentUser.userinfo.username,
          data_type: teamManagementProduct.data_type,
          profile_info: [
            {
              profile_title: firstSelection,
              Role: secondSelection,
              version: "1.0",
              project: Proj_Lead,
            },
          ],
        },
        []
      )
      .then((response) => {
        console.log(response);
        setFirstSelection("");
        setSecondSelection("");
        setAlert(true);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  const projectList = [
    "Workflow AI",
    "Data Analyst",
    "Global functions",
    "Organiser",
    "Hr Hiring",
    "Law Intern",
    "NPS Live",
    "Voice of Consumer",
    "Login",
    "Business development",
    "QR code generation",
    "Social Media Automation",
    "Online shops",
    "License compatibility",
    "Live UX Dashboard",
    "HR Intern",
    "Sale Agent",
    "Sales Coordinator",
  ];
  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Settings"}
    >
      {loading || loading2 ? (
        <LoadingSpinner />
      ) : (
        <div style={{ backgroundColor: "#fafafa" }}>
          {alert && <Alert />}
          <div className="table_team_roles">
            <h2>Portfolio/Team roles</h2>

            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Member portfolio name</th>
                  <th>Role Assigned</th>
                  <th>Update role</th>
                </tr>
              </thead>
              <tbody>
                {options1?.map((option, index) => (
                  <TableRow
                    index={index}
                    key={index}
                    option={option}
                    settingUserProfileInfo={settingUserProfileInfo}
                    rolesDict={rolesDict}
                    currentUser={currentUser}
                    Proj_Lead={Proj_Lead}
                    setAlert={setAlert}
                    setLoading={setLoading}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </StaffJobLandingLayout>
  );
};

export default AdminSettings;
