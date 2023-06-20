import { currentBackendAxiosInstance } from "./axios";

export const addNewJob = async (dataToPost) => {
  const response = await currentBackendAxiosInstance.post(
    "admin_create_jobs/",
    dataToPost
  );
  return response;
};

export const deleteJob = async (data , document_id) => {
  return await currentBackendAxiosInstance.post(`admin_delete_job/${document_id}/`,data)
}

export const updateJob = async(data)=>{
  console.log(data);
  return await currentBackendAxiosInstance.post("admin_update_jobs/", data)
}


export const getApplicationForAdmin = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `candidate_get_job_application/${company_id}/`
  );
};

export const getJobsFromAdmin = async (company_id) => {
  return await currentBackendAxiosInstance.get(`admin_get_all_jobs/${company_id}/`)
}