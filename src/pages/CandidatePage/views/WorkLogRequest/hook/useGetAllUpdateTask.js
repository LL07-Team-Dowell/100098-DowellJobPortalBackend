import { useEffect } from "react";
import { useState } from "react";
import { getAllUpdateTaskRequests } from "../../../../../services/commonServices";

export const useGetAllUpdateTask = (currentUser) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    setLoading(true);
    getAllUpdateTaskRequests(currentUser.portfolio_info[0].org_id)
      .then((response) => {
        setLoading(false);
        const { portfolio_name, username } = currentUser.portfolio_info[0];
        const newResponse = response.data.response.data.filter(
          (element) =>
            username === element.username &&
            portfolio_name === element.portfolio_name
        );
        setData(newResponse);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }, []);

  return { data, loading, error };
};
