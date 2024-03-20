import { currentBackendAxiosInstance, getCommitsInstance } from "./axios";

export const getProjectTime = async (companyId) => {
  return await currentBackendAxiosInstance.get(
    `get_all_projects_time/${companyId}/`
  );
};

export const addProjectTime = async (data) => {
  return await currentBackendAxiosInstance.post(
    "/add_project_total_time/",
    data
  );
};

export const updateProjectTime = async (data) => {
  return await currentBackendAxiosInstance.patch("/update_project_time/", data);
};

export const updateProjectTimeEnabled = async (data) => {
  return await currentBackendAxiosInstance.patch(
    "/update_project_time_enabled/",
    data
  );
};

export const getSingleProjectTime = async (documentId) => {
  return await currentBackendAxiosInstance.get(
    `get_project_time/${documentId}/`
  );
};

export const getCommits = async () => {
  return await getCommitsInstance.get(
    `reports/get-statistics/6385c0f18eca0fb652c94561/`
  );
};
