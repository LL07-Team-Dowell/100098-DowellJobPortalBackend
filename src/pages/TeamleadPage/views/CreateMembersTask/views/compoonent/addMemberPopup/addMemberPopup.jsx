import React, { useEffect, useState } from "react";
import "./addMemberPopup.scss";
import { useCurrentUserContext } from "../../../../../../../contexts/CurrentUserContext";
import { EditTeam } from "../../../../../../../services/createMembersTasks";
import { toast } from "react-toastify";
import { BsPlus } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import LittleLoading from "../../../../../../CandidatePage/views/ResearchAssociatePage/littleLoading";
import LoadingSpinner from "../../../../../../../components/LoadingSpinner/LoadingSpinner";
import { teamManagementProductName } from "../../../../../../../utils/utils";
import { testingRoles } from "../../../../../../../utils/testingRoles";
import { getUserInfoFromLoginAPI } from "../../../../../../../services/authServices";
import { AiOutlineClose } from "react-icons/ai";

const returnMissingMember = (bigMember, smallMember) => {
  let data = bigMember;
  smallMember.forEach((element) => {
    data = data?.filter((e) => e !== element);
  });
  return data;
};

const AddMemberPopup = ({
  bigMember,
  members,
  team_name,
  setmembers,
  close,
  setTeamName,
  getElementToTeamState,
  setteam,
  team,
}) => {
  const [name, setname] = useState(team_name);
  const [loading, setloading] = useState(false);
  const [desplaidMembers, setDesplaidMembers] = useState(
    returnMissingMember(bigMember, members)?.map((member, index) => ({
      id: index,
      member,
    }))
  );
  const [filtered, setfiltered] = useState([]);
  const [inputMembers, setInputMembers] = useState([]);
  const [query, setquery] = useState("");
  const {
    currentUser,
    setCurrentUser,
    portfolioLoaded,
    setPortfolioLoaded,
    isNotOwnerUser,
    setIsNotOwnerUser,
    allCompanyApplications,
  } = useCurrentUserContext();

  const AddedMember = (id) => {
    // setInputMembers([
    //   ...inputMembers,
    //   desplaidMembers?.find((f) => f.id === id),
    // ]);
    // setDesplaidMembers(desplaidMembers?.filter((f) => f.id !== id));
    console.log(id);
    console.log(desplaidMembers?.filter((f) => f.id !== id));
  };
  const removeMember = (id) => {
    setInputMembers(inputMembers.filter((f) => f.id !== id));
    setDesplaidMembers([
      ...desplaidMembers,
      inputMembers.find((f) => f.id === id),
    ]);
  };

  const EditTeamFunction = () => {
    // if (!loading) {
    // }
    if (name && inputMembers.length > 0) {
      setloading(true);
      EditTeam(team._id, {
        team_name,
        team_description: team.team_description,
        members: [...inputMembers.map((m) => m.member)],
      })
        .then((resp) => {
          console.log(resp);
          getElementToTeamState(name, [...inputMembers.map((m) => m.member)]);
          setteam({
            ...team,
            members: [...inputMembers.map((m) => m.member)],
          });
          toast.success("Edit Team Successfully");
          close();
          setloading(false);
        })
        .catch((err) => {
          console.log(name, [...inputMembers.map((m) => m.member)]);
          setloading(false);
        });
    } else {
      toast.error("Complete all fields before submitting");
      setloading(false);
    }
  };

  useEffect(() => {
    const newMembers = members.map((v, i) => ({
      id: new Date().getTime() + i,
      member: v,
    }));
    setInputMembers([...newMembers]);

    if (portfolioLoaded) {
      const membersFromUserPortfolio = isNotOwnerUser
        ? currentUser?.selected_product?.userportfolio
            .map((v) =>
              v.username.length !== 0 && v.username[0] !== "owner"
                ? Array.isArray(v.username)
                  ? v.username[0]
                  : v.username
                : null
            )
            .filter((v) => v !== null)
        : currentUser?.userportfolio
            ?.filter((user) => user.member_type !== "owner")
            .map((v) =>
              v.username.length !== 0
                ? Array.isArray(v.username)
                  ? v.username[0]
                  : v.username
                : null
            )
            .filter((v) => v !== null);

      setDesplaidMembers(
        returnMissingMember(membersFromUserPortfolio, members)?.map(
          (member, index) => ({ id: index, member })
        )
      );
      console.log(desplaidMembers);
      return;
    }

    const currentSessionId = sessionStorage.getItem("session_id");
    if (!currentSessionId) return;

    const teamManagementProduct = currentUser?.portfolio_info.find(
      (item) =>
        item.product === teamManagementProductName &&
        item.member_type === "owner"
    );

    if (
      !(
        (currentUser.settings_for_profile_info &&
          currentUser.settings_for_profile_info.profile_info[
            currentUser.settings_for_profile_info.profile_info.length - 1
          ].Role === testingRoles.superAdminRole) ||
        currentUser.isSuperAdmin
      ) &&
      !teamManagementProduct
    ) {
      console.log("No team management product found for current user");
      const membersFromUserPortfolio = allCompanyApplications.map(
        (application) => {
          return {
            member: application.username,
            id: application._id,
          };
        }
      );

      setDesplaidMembers(
        returnMissingMember(membersFromUserPortfolio, members)?.map(
          (member, index) => ({ id: index, member })
        )
      );
      setIsNotOwnerUser(true);
      return setPortfolioLoaded(true);
    }

    const dataToPost = {
      session_id: currentSessionId,
      product: teamManagementProduct?.product
        ? teamManagementProduct?.product
        : teamManagementProductName,
    };

    getUserInfoFromLoginAPI(dataToPost)
      .then((res) => {
        setCurrentUser(res.data);
        const membersFromUserPortfolio = allCompanyApplications.map(
          (application) => {
            return {
              member: application.username,
              id: application._id,
            };
          }
        );

        setDesplaidMembers(
          returnMissingMember(membersFromUserPortfolio, members)?.map(
            (member, index) => ({ id: index, member })
          )
        );
        setPortfolioLoaded(true);
        setIsNotOwnerUser(false);
      })
      .catch((err) => {
        console.log("Failed to get user details from login API");
        console.log(err.response ? err.response.data : err.message);
        setPortfolioLoaded(true);
      });
  }, []);

  useEffect(() => {
    console.log(query, "query");
    if (desplaidMembers) {
      const filtereddd = desplaidMembers.filter((f) =>
        f.member.member.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      );
      setfiltered(filtereddd);
    }
  }, [desplaidMembers]);

  return (
    <div className="overlay">
      <div className="add-member-popup" style={{ zIndex: 100 }}>
        <button className="close-btn" onClick={close}>
          <AiOutlineClose />
        </button>
        <h2>Edit Team Members</h2>
        <br />
        <label htmlFor="">Team Members</label>
        <div className="added-members-input">
          {inputMembers.map((v) => (
            <div key={v.id} onClick={() => removeMember(v.id)}>
              <p>{v.member}</p>
              <FaTimes fontSize={"small"} />
            </div>
          ))}
          <input
            type="text"
            placeholder="search member"
            value={query}
            onChange={(e) => setquery(e.target.value)}
          />
        </div>
        <div></div>
        <br />
        <label htmlFor="task_name">Select Members</label>
        {!portfolioLoaded ? (
          <LoadingSpinner width={"1.5rem"} height={"1.5rem"} />
        ) : (
          <div className="members">
            {filtered.length > 0 ? (
              filtered.map((element) => (
                <div
                  key={element.id}
                  className="single-member"
                  onClick={() => AddedMember(element.id)}
                >
                  <p>{element.member.member}</p>
                  <BsPlus />
                </div>
              ))
            ) : (
              <h3>No More Members</h3>
            )}
          </div>
        )}

        <button className="edit-team" onClick={() => EditTeamFunction()}>
          {loading ? (
            <LoadingSpinner color={"white"} width="20px" height="20px" />
          ) : (
            "Edit Team"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddMemberPopup;
