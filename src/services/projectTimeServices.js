import { currentBackendAxiosInstance } from "./axios";

export const getProjectTime = async (companyId) => {
  return await currentBackendAxiosInstance.get(
    `get_all_projects_time/${companyId}/`
  );
};
