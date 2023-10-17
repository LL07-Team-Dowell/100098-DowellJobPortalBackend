import React, { useState, useEffect } from "react";
import TasksCo from "./TasksCo";
import Teams from "./component/Teams";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { AiOutlinePlus, AiOutlineTeam } from "react-icons/ai";
import { useValues } from "./context/Values";
import axios from "axios";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import "./index.scss";
import { getAllTeams } from "../../../../services/createMembersTasks";
import Navbar from "./component/Navbar";

const Index = ({ isGrouplead }) => {
  const { currentUser } = useCurrentUserContext();
  const { data, setdata } = useValues();
  const [response, setresponse] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [teamInfo, setTeamInfo] = useState({});

  const unshowDeletePopup = () => {
    setShowDeletePopup(false);
  };
  const showDeletePopupFunction = (id) => {
    setTeamId(id);
    setShowDeletePopup(true);
  };
  const unShowEditTeam = () => {
    setShowEditPopup(false);
  };
  const showEditPopupFunction = (id, name, description, members) => {
    setTeamId(id);
    setShowEditPopup(true);
    setTeamInfo({ name, description, members });
  };
  const deleteTeamState = (id) => {
    setdata({
      ...data,
      TeamsSelected: data.TeamsSelected.filter((v) => v._id !== id),
    });
  };
  useEffect(() => {
    getAllTeams(currentUser.portfolio_info[0].org_id)
      .then((resp) => {
        console.log(resp.data.response.data);

        const [teamsCreatedByUser, teamsUserIsAMemberOf] = [
          resp.data.response.data
            .filter((team) => team.created_by === currentUser.userinfo.username)
            .filter(
              (team) =>
                team.data_type === currentUser.portfolio_info[0].data_type
            ),
          resp.data.response.data
            .filter((team) =>
              team?.members.includes(currentUser.userinfo.username)
            )
            .filter(
              (team) =>
                team.data_type === currentUser.portfolio_info[0].data_type
            ),
        ];

        const teamsToShowForUser = [
          ...new Map(
            [...teamsCreatedByUser, ...teamsUserIsAMemberOf].map((team) => [
              team._id,
              team,
            ])
          ).values(),
        ];

        setdata({
          ...data,
          TeamsSelected: teamsToShowForUser,
        });
        setresponse(true);
      })
      .catch((e) => {
        setresponse(true);
        console.log(e);
      });
  }, []);
  console.log(searchValue);
  console.log(data.TeamsSelected.length);

  if (data.TeamsSelected.length === 0 && !response)
    return (
      <StaffJobLandingLayout
        teamleadView={true}
        isGrouplead={isGrouplead}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        searchTeam={true}
      >
        <LoadingSpinner />
      </StaffJobLandingLayout>
    );

  return (
    <StaffJobLandingLayout
      teamleadView={true}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      searchTeam={true}
      isGrouplead={isGrouplead}
    >
      <Navbar title={"All Teams"} color={"#005734"} noButtonBack={true} />
      <div className='container'>
        <Teams
          searchValue={searchValue}
          data={data}
          deleteTeamState={deleteTeamState}
          unshowDeletePopup={unshowDeletePopup}
          showDeletePopup={showDeletePopup}
          teamId={teamId}
          setTeamId={setTeamId}
          showDeletePopupFunction={showDeletePopupFunction}
          showEditPopupFunction={showEditPopupFunction}
          showEditPopup={showEditPopup}
          teamInfo={teamInfo}
          unShowEditTeam={unShowEditTeam}
        />
      </div>
    </StaffJobLandingLayout>
  );
};

export default Index;
const iconsStyle = {
  fontSize: 60,
};
