import { currentBackendAxiosInstance } from "./axios"

export const changeCandidateStatusToShortlisted = async (data) => {
  return await currentBackendAxiosInstance.post("hr_management/shortlisted_candidate/", data)
}

export const addSelectedCandidate = async (data) => {
  return await currentBackendAxiosInstance.post("hr_management/selected_candidate/", data)
}

export const getCandidateApplicationsForHr = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `/candidate_management/get_job_application/${company_id}/`
  );
};


export const getCandidateTask = async (companyId) => {
  return await currentBackendAxiosInstance.get(`get_task/${companyId}/`)
}

export const rejectCandidateApplicationforHr = async (data) => {
  return await currentBackendAxiosInstance.post("hr_management/reject_candidate/", data)
}

export const getSettingUserProject = async () => {
  return await currentBackendAxiosInstance.get('setting/SettingUserProject/')
}

export const getJob = async (data) => {
  return await currentBackendAxiosInstance.post("admin_management/get_job/", data)
}