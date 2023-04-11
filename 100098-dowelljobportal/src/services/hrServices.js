import { currentBackendAxiosInstance } from "./axios"

export const changeCandidateStatusToShortlisted = async (data) => {
  return await currentBackendAxiosInstance.post("hr_management/shortlisted_candidate/", data)
}

export const addSelectedCandidate = async (data) => {
  return await currentBackendAxiosInstance.post("hr_management/selected_candidate/", data)
}

export const getCandidateApplicationsForHr = async (data) => {
  return await currentBackendAxiosInstance.post("/candidate_management/get_job_application/", data)
}


export const getCandidateTask = async (data) => {
  return await currentBackendAxiosInstance.post("task_management/get_task/", data)
}

export const rejectCandidateTask = async (data) => {
  return await currentBackendAxiosInstance.post("hr_management/reject_candidate/", data)
}

export const getSettingUserProject = async () => {
  return await currentBackendAxiosInstance.get('setting/SettingUserProject/')
}