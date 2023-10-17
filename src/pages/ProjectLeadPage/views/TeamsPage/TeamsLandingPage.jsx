import { useState } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import Teams from "../../../CandidatePage/views/TeamsScreen/components/Teams";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";
import { useValues } from "../../../TeamleadPage/views/CreateMembersTask/context/Values";
import { useEffect } from "react";
import { getAllTeams } from "../../../../services/createMembersTasks";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";

const ProjectLeadTeams = () => {
    const { currentUser } = useCurrentUserContext();
    const { data, setdata } = useValues();
    const [response, setresponse] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [teamId, setTeamId] = useState("");

    const unshowDeletePopup = () => {
        setShowDeletePopup(false);
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
            .filter(
              (team) => 
                team?.created_by === currentUser?.userinfo?.username ||
              team?.members?.includes(currentUser?.userinfo?.username)
            ),
            });
            setresponse(true);
        })
        .catch((e) => {
            console.log(e);
            setresponse(true);
        });
    }, []);
    
    if (data.TeamsSelected.length === 0 && !response) return (
        <StaffJobLandingLayout
            projectLeadView={true}
            hideSearchBar={true}
        >
            <LoadingSpinner />
        </StaffJobLandingLayout>
    );

    return (
        <StaffJobLandingLayout
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            searchTeam={true}
            projectLeadView={true}
        >
            <Navbar color={"#005734"} noButtonBack={true} adminTeams={true} />
            <div className="container">
                <Teams
                    searchValue={searchValue}
                    data={data}
                    deleteTeamState={deleteTeamState}
                    unshowDeletePopup={unshowDeletePopup}
                    showDeletePopup={showDeletePopup}
                    teamId={teamId}
                    setTeamId={setTeamId}
                    showDeletePopupFunction={showDeletePopupFunction}
                />
            </div>
        </StaffJobLandingLayout>
    );
}

export default ProjectLeadTeams;