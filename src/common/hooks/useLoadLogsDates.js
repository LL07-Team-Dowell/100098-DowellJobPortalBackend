import { useEffect } from "react";
import { getWorklogDatesForUser } from "../../services/commonServices";

export default function useLoadLogsDates ({
    user,
    updateLogDatesData,
    dataLoaded,
    updateDataLoaded,
    updateDataLoading,
}) {

    useEffect(() => {
        if (!user || dataLoaded) return;
        
        const dataToPost = {
            "user_id": user?.userinfo?.userID,
            "company_id":  user?.portfolio_info[0]?.org_id,
            "data_type": user?.portfolio_info[0]?.data_type,
        }

        getWorklogDatesForUser(dataToPost).then(res => {
            updateLogDatesData(res.data?.data);
            updateDataLoaded(true);
            updateDataLoading(false);
        }).catch(err => {
            console.log('An error occured trying to get log dates: ', err?.response?.data);
            updateDataLoading(false);
            updateDataLoaded(false);
        })

    }, [user])

}