import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { useValues } from "../context/Values";
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import {
  createTeam,
  getAllTeams,
} from "../../../../../services/createMembersTasks";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import { teamManagementProductName } from "../../../../../utils/utils";
import { toast } from "react-toastify";
import { BsPlus } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import LittleLoading from "../../../../CandidatePage/views/ResearchAssociatePage/littleLoading";
import LoadingSpinner from "../../../../../components/LoadingSpinner/LoadingSpinner";
import { getUserInfoFromLoginAPI } from "../../../../../services/authServices";
import { testingRoles } from "../../../../../utils/testingRoles";

const CreateTeam = ({ isAdmin }) => {
  // USER
  const {
    currentUser,
    setCurrentUser,
    portfolioLoaded,
    setPortfolioLoaded,
    isNotOwnerUser,
    setIsNotOwnerUser,
    allCompanyApplications,
  } = useCurrentUserContext();
  // DATA
  const { data, setdata } = useValues();
  const MembersCurrentUser = currentUser?.settings_for_profile_info
    ?.fakeSuperUserInfo
    ? currentUser?.userportfolio
      ?.filter((user) => user.member_type !== "owner")
      .map((v) =>
        v.username.length !== 0
          ? Array.isArray(v.username)
            ? v.username[0]
            : v.username
          : null
      )
      .filter((v) => v !== null)
      .map((v, i) => ({ member: v, id: i }))
    : currentUser?.selected_product?.userportfolio
      .map((v) =>
        v.username.length !== 0 && v.username[0] !== "owner"
          ? Array.isArray(v.username)
            ? v.username[0]
            : v.username
          : null
      )
      .filter((v) => v !== null)
      .map((v, i) => ({ member: v, id: i }));
  // States
  const [showCard, setshowCard] = useState(false);
  const [toggleCheckboxes, settoggleCheckboxes] = useState(false);
  const [displaidMembers, setDesplaidMembers] = useState([]);
  const [inputMembers, setInputMembers] = useState([]);
  const [query, setquery] = useState("");
  const [loading, setLoading] = useState(false);

  // Navigate
  const navigate = useNavigate();
  // FUNCTIONS
  const changeTeamName = (e) => {
    setdata({ ...data, team_name: e.target.value });
  };
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setdata({ ...data, selected_members: [...data.selected_members, value] });
  };
  const AddedMember = (id) => {
    setInputMembers([
      ...inputMembers,
      displaidMembers.find((f) => f.id === id),
    ]);
    setDesplaidMembers(displaidMembers.filter((f) => f.id !== id));
  };
  const removeMember = (id) => {
    setInputMembers(inputMembers.filter((f) => f.id !== id));
    setDesplaidMembers([
      ...displaidMembers,
      inputMembers.find((f) => f.id === id),
    ]);
  };

  useEffect(() => {
    if (portfolioLoaded) {
      setDesplaidMembers(
        isNotOwnerUser
          ? currentUser?.selected_product?.userportfolio
            .map((v) =>
              v.username.length !== 0 && v.username[0] !== "owner"
                ? Array.isArray(v.username)
                  ? v.username[0]
                  : v.username
                : null
            )
            .filter((v) => v !== null)
            .map((v, i) => ({ member: v, id: i }))
          : currentUser?.userportfolio
            ?.filter((user) => user.member_type !== "owner")
            .map((v) =>
              v.username.length !== 0
                ? Array.isArray(v.username)
                  ? v.username[0]
                  : v.username
                : null
            )
            .filter((v) => v !== null)
            .map((v, i) => ({ member: v, id: i }))
      );
      return;
    }

    const currentSessionId = sessionStorage.getItem("session_id");
    if (!currentSessionId) return;

    const teamManagementProduct = currentUser?.portfolio_info.find(
      (item) =>
        item.product === teamManagementProductName && item.member_type === "owner"
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
      setDesplaidMembers(
        allCompanyApplications.map(application => {
          return {
            member: application.username,
            id: application._id,
          }
        })
      );
      setIsNotOwnerUser(true);
      return setPortfolioLoaded(true);
    }

    const dataToPost = {
      session_id: currentSessionId,
      product: teamManagementProduct?.product ? teamManagementProduct?.product : teamManagementProductName,
    };

    getUserInfoFromLoginAPI(dataToPost)
      .then((res) => {
        setCurrentUser(res.data);
        setDesplaidMembers(
          allCompanyApplications.map(application => {
            return {
              member: application.username,
              id: application._id,
            }
          })
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

  const createTeamSubmit = () => {
    if (
      data.team_name.length > 0 &&
      inputMembers.length > 0 &&
      data.teamDiscription
    ) {
      if (!loading) {
        setLoading(true);
        createTeam({
          team_name: data.team_name,
          team_description: data.teamDiscription,
          company_id: currentUser.portfolio_info[0].org_id,
          members: inputMembers.map((v) => v.member),
          created_by: currentUser.userinfo.username,
          data_type: currentUser.portfolio_info[0].data_type,
          admin_team: isAdmin ? true : false,
        })
          .then((resp) => {
            navigate(
              `/team-screen-member/${resp.data.response.inserted_id}/team-tasks`
            );
            setdata({
              ...data,
              TeamsSelected: {
                ...data.TeamsSelected,
                team_name: data.team_name,
                _id: resp.data.response.inserted_id,
              },
            });
            toast.success("team created successfully !");
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      toast.error("some data are missing fill all the inputs");
      console.log(data.team_name, inputMembers, data.teamDiscription);
    }
  };

  // console.log(displaidMembers);
  const userIsThere = (user) =>
    data.selected_members.find((newUser) => newUser === user);

  if (!portfolioLoaded) return <LoadingSpinner />;

  return (
    <>
      <Navbar title=" Create Team" color={"#005734"} removeButton={true} />
      <div className="container" style={{ position: "relative" }}>
        <div
          style={{ marginTop: 30 }}
          className=" Create_Team"
          onClick={() => {
            setshowCard(true);
          }}
        >
          <div>
            <div>
              <AiOutlinePlusCircle
                className="icon"
                style={{ fontSize: "2rem" }}
              />
            </div>
            <h4>Create a Team</h4>
            <p>
              Bring everyone together and get to work. Work together in a team
              to increase productivity.
            </p>
          </div>
        </div>
        {showCard ? (
          <div className="overlay">
            <div className="create_your_team  " tabIndex={0}>
              <button
                className="create_your_team-remove-btn"
                onClick={() => {
                  setshowCard(false);
                }}
              >
                <AiOutlineClose />
              </button>
              <h2 className="">Create Your Team</h2>
              <label htmlFor="team_name">Team Name</label>
              <input
                type="text"
                id="team_name"
                className=""
                placeholder="Choose a Team Name"
                onChange={changeTeamName}
              />
              <br />
              <label htmlFor="team_description">Team Description</label>
              <textarea
                type="text"
                id="team_description"
                className=""
                placeholder="Choose a Team Description"
                rows={10}
                onChange={(e) =>
                  setdata({ ...data, teamDiscription: e.target.value })
                }
              />
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
              <br />
              <label htmlFor="task_name">Select Members</label>
              <div className="members">
                {[...new Map(displaidMembers.map((member) => [member.member, member])).values()]?.filter((f) => f.member.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
                  .length > 0 ? (
                  [...new Map(displaidMembers.map((member) => [member.member, member])).values()]
                    ?.filter((f) => f.member.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
                    ?.map((element) => (
                      <div
                        className="single-member"
                        onClick={() => AddedMember(element.id)}
                      >
                        <p>{element.member}</p>
                        <BsPlus />
                      </div>
                    ))
                ) : (
                  <h3>No More Members</h3>
                )}
              </div>
              {/* a */}
              <br />
              <div className="buttons">
                <button onClick={createTeamSubmit}>
                  {loading ? (
                    <LoadingSpinner
                      color={"white"}
                      width="20px"
                      height="20px"
                    />
                  ) : (
                    "Create"
                  )}
                </button>
                <button onClick={() => setshowCard(false)}>Cancel</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CreateTeam;

{
  /* <label htmlFor=''>Add asdasd</label>
          <div
            className='add_member_input'
            onClick={() => settoggleCheckboxes(!toggleCheckboxes)}
          >
            <p>Choose team members</p>
            <AiOutlinePlusCircle className='icon' />
          </div>
          <br />
          {toggleCheckboxes ? (
            <div className='checkboxes'>
               {currentUser?.selected_product?.userportfolio.map((user, index) => user.username[0] !== 'owner' ?  (
            <div key={index}>
              <input
                type='checkbox'
                value={user.username[0]}
                onChange={handleCheckboxChange}
                checked={userIsThere(user.username[0]) !== undefined ? true : false}
              />
              <span>{user.username[0]}</span>
            </div>
          ) : null)} */
}
{
  /* {data.memebers.map((member, i) => (
                <div key={i}>
                  <input
                    type='checkbox'
                    value={member}
                    onChange={handleCheckboxChange}
                    checked={userIsThere(member) !== undefined ? true : false}
                  />
                  <span>{member}</span>
                </div>
              ))} */
}
{
  /* </div>
          ) : null} */
}
