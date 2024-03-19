import { useEffect, useState } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { getAllTeams } from "../../../../services/createMembersTasks";
import { useCandidateValuesProvider } from "../../../../contexts/CandidateTeamsContext";
import Teams from "./components/Teams";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";

const TeamsScreen = () => {
  const { currentUser } = useCurrentUserContext();
  const { data, setdata } = useCandidateValuesProvider();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    getAllTeams(currentUser.portfolio_info[0].org_id)
      .then((resp) => {
        setdata({
          ...data,
          TeamsSelected: resp.data.response.data
            .filter((team) =>
              team?.members.includes(currentUser.userinfo.username)
            )
            .filter(
              (team) =>
                team?.data_type === currentUser.portfolio_info[0].data_type
            ),
        });
        setDataLoaded(true);
      })
      .catch((e) => {
        setDataLoaded(true);
      });
  }, []);

  if (data.TeamsSelected.length === 0 && !dataLoaded)
    return (
      <JobLandingLayout user={currentUser} afterSelection={true}>
        <LoadingSpinner />
      </JobLandingLayout>
    );

  return (
    <>
      <JobLandingLayout user={currentUser} afterSelection={true}>
        <Navbar
          removeButton={true}
          title="All Teams"
          color={"#005734"}
          noButtonBack={true}
        />
        <div className="container">
          <Teams searchValue={""} data={data} />
        </div>
      </JobLandingLayout>
    </>
  );
};

export default TeamsScreen;
