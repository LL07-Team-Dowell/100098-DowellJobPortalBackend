import { currentBackendAxiosInstance } from "./axios";

export const addNewJob = async (dataToPost) => {
  const response = await currentBackendAxiosInstance.post(
    "admin_management/create_jobs/",
    dataToPost
  );
  return response;
};

export const deleteJob = async (data) => {
  return await currentBackendAxiosInstance.post("admin_management/delete_job/",data)
}
