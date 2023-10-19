import React, { useState, useEffect } from "react";
import Teams from "../../../TeamleadPage/views/CreateMembersTask/component/Teams";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { useValues } from "../../../TeamleadPage/views/CreateMembersTask/context/Values";
import { getAllTeams } from "../../../../services/createMembersTasks";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import "./index.scss";

const AdminTeam = () => {
  const { currentUser } = useCurrentUserContext();
  const { data, setdata } = useValues();
  const [response, setresponse] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [teamInfo, setTeamInfo] = useState({});

  const showEditPopupFunction = (id, name, description, members) => {
    setTeamId(id);
    setShowEditPopup(true);
    setTeamInfo({ name, description, members });
  };
  const unshowDeletePopup = () => {
    setShowDeletePopup(false);
  };
  const unShowEditTeam = () => {
    setShowEditPopup(false);
  };
  const showDeletePopupFunction = (id) => {
    setTeamId(id);
    setShowDeletePopup(true);
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
        setdata({
          ...data,
          TeamsSelected: resp.data.response.data.filter(
            (team) => team.data_type === currentUser.portfolio_info[0].data_type
          )
          // .filter(
          //   (team) => 
          //     team?.created_by === currentUser?.userinfo?.username ||
          //   team?.members?.includes(currentUser?.userinfo?.username)
          // ),
        });
        setresponse(true);
      })
      .catch((e) => {
        console.log(e);
        setresponse(true);
      });
  }, []);
  console.log(searchValue);
  console.log(data.TeamsSelected.length);
  if (data.TeamsSelected.length === 0 && !response)
    return (
      <StaffJobLandingLayout
        adminView={true}
        pageTitle={"All Teams"}
        adminAlternativePageActive={true}
      >
        <LoadingSpinner />
      </StaffJobLandingLayout>
    );
  return (
    <StaffJobLandingLayout
      adminView={true}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      searchTeam={true}
      pageTitle={"All Teams"}
      adminAlternativePageActive={true}
    >
      <Navbar color={"#005734"} noButtonBack={true} adminTeams={true} />
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

export default AdminTeam;
const iconsStyle = {
  fontSize: 60,
};
