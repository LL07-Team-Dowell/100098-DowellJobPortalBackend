import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
export const useGetAllUpdateTask = (currentUser) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    useEffect(() => {
        setLoading(true);
        axios(`
        https://100098.pythonanywhere.com/get_all_update_task/${currentUser.portfolio_info[0].org_id}`)
            .then(response => {
                setLoading(false);
                setData(response.data.response.data);
            })
            .catch(error => setError(error.message))
    }, [])
    return { data, loading, error }

}