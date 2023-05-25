import { currentBackendAxiosInstance } from "./axios"

export const changeCandidateStatusToShortlisted = async (data) => {
  return await currentBackendAxiosInstance.post("hr_management/shortlisted_candidate/", data)
}

export const addSelectedCandidate = async (data) => {
  return await currentBackendAxiosInstance.post("hr_management/selected_candidate/", data)
}

// export const getCandidateApplicationsForHr = async (data) => {
//   return await currentBackendAxiosInstance.post("/candidate_management/get_job_application/", data)
// }
export const getCandidateApplicationsForHr = async (data) => {
  return await currentBackendAxiosInstance.get(`/candidate_management/get_job_application/${data.company_id}/`)
}


export const getCandidateTask = async (companyId) => {
  return await currentBackendAxiosInstance.get(`task_management/get_task/${companyId}/`)
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