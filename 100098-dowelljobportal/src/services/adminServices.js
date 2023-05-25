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

export const updateJob = async(data)=>{
  console.log(data);
  return await currentBackendAxiosInstance.post("admin_management/update_jobs/", data)
}


export const getApplicationForAdmin = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `candidate_management/get_job_application/${company_id}/`
  );
};

export const getJobsFromAdmin = async (data) => {
  return await currentBackendAxiosInstance.post("admin_management/get_jobs/",data)
}