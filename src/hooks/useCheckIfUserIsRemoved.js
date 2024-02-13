import { useEffect } from "react";
import { getAppliedJobs } from "../services/candidateServices";
import { candidateStatuses } from "../pages/CandidatePage/utils/candidateStatuses";

export default function useCheckIfUserIsRemoved(
  userDetails,
  updateUserRemovedStatus,
  updateLoadingStatus,
  removalStatusChecked,
  updateRemovalStatusChecked,
  setNewContract,
  updateCurrentUserApplications,
  updateCurrentUserApplicationsLoaded,
  updateAllApplications,
) {
  useEffect(() => {
    if (removalStatusChecked || !userDetails) return updateLoadingStatus(false);

    updateLoadingStatus(true);

    getAppliedJobs(userDetails?.portfolio_info[0]?.org_id).then(res => {
      const allApplications = res?.data?.response?.data?.filter(
        (application) => application.data_type === userDetails?.portfolio_info[0]?.data_type
      );

      const currentUserAppliedJobs = allApplications.filter(
        (application) => application.username === userDetails?.userinfo?.username
      )

      updateAllApplications(allApplications);
      updateCurrentUserApplications(currentUserAppliedJobs.filter(application => application.status === candidateStatuses.ONBOARDING));
      updateCurrentUserApplicationsLoaded(true);
      
      if (currentUserAppliedJobs.find(application => application.status === candidateStatuses.REMOVED)) {
        updateUserRemovedStatus(true);
      }
      if (currentUserAppliedJobs.find(application => application.status === candidateStatuses.RENEWCONTRACT)) {
        setNewContract(true);
      }
      updateLoadingStatus(false);
      updateRemovalStatusChecked(true);
    }).catch(err => {
      console.log('Failed to fetch applications in staff layout');
      updateLoadingStatus(false);
      updateRemovalStatusChecked(true);
    })
  }, [])
}