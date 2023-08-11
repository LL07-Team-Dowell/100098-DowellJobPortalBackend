import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
export default function TableRow({
  index,
  option,
  settingUserProfileInfo,
  rolesDict,
  currentUser,
  Proj_Lead,
  projectList,
  hiredCandidates,
  currentFilter,
}) {
  const [roleAssigned, setRoleAssigned] = useState('No role assigned yet');
  const [ updatedRole, setUpdatedRole ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  
  useEffect(() => {
    setRoleAssigned(
      settingUserProfileInfo
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
        : "Invalid role assigned"
      : "No Role assigned yet"
    )
  }, [currentFilter])
  
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
              profile_title: option.portfolio_name,
              Role: updatedRole,
              version: "1.0",
              project: Proj_Lead,
            },
          ],
        },
        []
      )
      .then((response) => {
        console.log(response);
        setRoleAssigned(rolesDict[updatedRole]);
        setLoading(false);
        setUpdatedRole(null);
        toast.success(`Successfully updated role for ${option.portfolio_name}`)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false);
        setUpdatedRole(null);
      });
  };
  console.log({ roleAssigned });
  return (
    <tr>
      {" "}
      <td>{index + 1}</td>
      <td>{option.portfolio_name}</td>
      <td>{roleAssigned}</td>
      <td
        style={{
          color: hiredCandidates.includes(option.portfolio_name) ?
            '#005734' 
            :
            '#ff0000'
          ,
        }}  
      >
        {
          hiredCandidates.includes(option.portfolio_name) ?
          'Yes' :
          'No'
        }
      </td>
      <td className="update__Role">
        <select 
          defaultValue={""} 
          onChange={({ target }) => setUpdatedRole(target.value)} 
          style={{
            pointerEvents: hiredCandidates.includes(option.portfolio_name) ? 'all' : 'none',
            backgroundColor: hiredCandidates.includes(option.portfolio_name) ? '#fff' : `#f5f5f5`,
            filter: hiredCandidates.includes(option.portfolio_name) ? 'brightness(1)': 'brightness(0.9)'
          }}
        >
          <option value="" disabled>Update role</option>
          {Object.keys(projectList).map((projectValue, index) => (
            <option key={index} value={projectValue} selected={roleAssigned === projectList[projectValue]}>
              {projectList[projectValue]}
            </option>
          ))}
        </select>
        {
          updatedRole && rolesDict[roleAssigned] && roleAssigned !== rolesDict[updatedRole] && <div className="update__Role__For__Portfolio__Wrapper">
            <button disabled={loading} className="update__Role__For__Portfolio__Btn green" onClick={() => submit2()}>
              {
                loading ? <LoadingSpinner width={'0.8rem'} height={'0.8rem'} /> :
                <AiOutlineCheck />
              }
            </button>
            <button disabled={loading} className="update__Role__For__Portfolio__Btn red" onClick={() => setUpdatedRole(null)}>
              <AiOutlineClose />
            </button>
          </div>
        }
      </td>
    </tr>
  );
}
