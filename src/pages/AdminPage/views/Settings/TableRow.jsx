import React from "react";
import { useState } from "react";
import axios from "axios";
export default function TableRow({
  index,
  option,
  settingUserProfileInfo,
  rolesDict,
  currentUser,
  Proj_Lead,
  setAlert,
  setLoading,
}) {
  const roleAssignedPerson = settingUserProfileInfo
    .reverse()
    .find(
      (value) =>
        value["profile_info"][0]["profile_title"] === option.portfolio_name
    )
    ? rolesDict[
        settingUserProfileInfo
          .reverse()
          .find(
            (value) =>
              value["profile_info"][0]["profile_title"] ===
              option.portfolio_name
          )["profile_info"][0]["Role"]
      ]
      ? rolesDict[
          settingUserProfileInfo
            .reverse()
            .find(
              (value) =>
                value["profile_info"][0]["profile_title"] ===
                option.portfolio_name
            )["profile_info"][0]["Role"]
        ]
      : "No Role assigned yet"
    : "No Role assigned yet";
  const [roleAssigned, setRoleAssigned] = useState(roleAssignedPerson);
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
  const submit2 = (e) => {
    console.log({ valueofSubmit: e.target.value });
    const teamManagementProduct = currentUser.portfolio_info.find(
      (item) => item.product === "Team Management"
    );
    if (!teamManagementProduct) return;
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
              profile_title: option.portfolio_name,
              Role: e.target.value,
              version: "1.0",
              project: Proj_Lead,
            },
          ],
        },
        []
      )
      .then((response) => {
        console.log(response);
        setRoleAssigned(e.target.value);
      })
      .catch((error) => console.log(error));
  };
  console.log({ roleAssigned });
  return (
    <tr>
      {" "}
      <td>{index + 1}</td>
      <td>{option.portfolio_name}</td>
      <td>{roleAssigned}</td>
      <td>
        <select defaultValue={""} onChange={submit2}>
          <option value="">update role</option>
          {projectList.map((projectValue, index) => (
            <option key={index} value={projectValue}>
              {projectValue}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
