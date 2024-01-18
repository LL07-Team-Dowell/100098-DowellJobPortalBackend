import { useEffect } from "react";
import { addUserIdToApplication } from "../services/commonServices";

export default function useUpdateUserId (
    appLoading, 
    currentUser, 
    userApplications, 
    userApplicationsLoaded,
    updateUserApplications, 
    pendingApplicationsWithoutUserIdUpdated,
    updateApplicationsWithoutUserIdCheckedStatus,
) {
    useEffect(() => {
        if (appLoading || !currentUser || !Array.isArray(userApplications) || !userApplicationsLoaded) return

        if (pendingApplicationsWithoutUserIdUpdated) return;

        const userApplicationsWithoutUserId = userApplications.filter(application => !application.user_id);
        const userApplicationsWithUserId = userApplications.filter(application => application.user_id);
        const updatedApplications = [];

        Promise.all(userApplicationsWithoutUserId.map(async application => {
            const data = {
                "application_id": application._id,
                "user_id": currentUser?.userinfo?.userID,
                "data_type": currentUser?.portfolio_info[0]?.data_type
            }

            try {
                const res = (await addUserIdToApplication(data)).data;
                console.log('API Call response for user id update: ', res?.message);

                updatedApplications.push({
                    ...application,
                    user_id: currentUser?.userinfo?.userID,
                })
            } catch (error) {}

        })).then(() => {}).catch(err => {})

        updateUserApplications([
            ...updatedApplications,
            ...userApplicationsWithUserId,
        ]);
        updateApplicationsWithoutUserIdCheckedStatus(true);

    }, [appLoading, currentUser, userApplications, userApplicationsLoaded, pendingApplicationsWithoutUserIdUpdated])
}