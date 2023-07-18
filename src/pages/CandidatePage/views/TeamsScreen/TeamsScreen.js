import { useEffect, useState } from "react";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { PageUnderConstruction } from "../../../UnderConstructionPage/ConstructionPage"
import { useNavigate } from "react-router-dom";
import { AiOutlineTeam } from "react-icons/ai";
import { getAllTeams } from "../../../../services/createMembersTasks";
import { imageReturn } from "../../../TeamleadPage/views/CreateMembersTask/assets/teamsName";
import { useCandidateValuesProvider } from "../../../../contexts/CandidateTeamsContext";
import Teams from "./components/Teams";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Navbar from "../../../TeamleadPage/views/CreateMembersTask/component/Navbar";

const TeamsScreen = () => {
    const { currentUser } = useCurrentUserContext();
    const {data, setdata} = useCandidateValuesProvider()
    useEffect(()=>{
        getAllTeams(currentUser.portfolio_info[0].org_id)
        .then(resp =>{ 
            setdata({...data , TeamsSelected:resp.data.response.data})
      })
      .catch(e =>{
      })
    },[])
  if(data.TeamsSelected.length === 0)return <JobLandingLayout user={currentUser} afterSelection={true}><LoadingSpinner/></JobLandingLayout> 
    
    return <>
        <JobLandingLayout user={currentUser} afterSelection={true}>
        <Navbar removeButton={true} title='All Teams' color={'#005734'}  noButtonBack={true}/>
        <div className='container'>
            <Teams searchValue={""} data={data}/>
        </div>
        </JobLandingLayout>
    </>
}

export default TeamsScreen;

