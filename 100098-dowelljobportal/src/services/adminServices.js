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
export const getApplicationForAdmin = async (data) => {
  return await currentBackendAxiosInstance.post("candidate_management/get_job_application/",data)
}
