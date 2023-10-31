import { useEffect } from "react";
import { getAppliedJobs } from "../services/candidateServices";
import { candidateStatuses } from "../pages/CandidatePage/utils/candidateStatuses";

export default function useCheckIfUserIsRemoved (userDetails, updateUserRemovedStatus, updateLoadingStatus) {
    useEffect(() => {
        getAppliedJobs(userDetails?.portfolio_info[0]?.org_id).then(res => {
            const currentUserAppliedJobs = res.data.response.data.filter(
              (application) => application.data_type === userDetails?.portfolio_info[0]?.data_type
                &&
                  application.username === userDetails?.userinfo?.username
            )
      
            if (currentUserAppliedJobs.find(application => application.status === candidateStatuses.REMOVED)) {
                updateUserRemovedStatus(true);
            }
            
            updateLoadingStatus(false);
          }).catch(err => {
            console.log('Failed to fetch applications in staff layout');
            updateLoadingStatus(false);
          })
    }, [])
}