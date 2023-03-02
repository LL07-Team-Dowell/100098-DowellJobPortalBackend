import { currentBackendAxiosInstance } from "./axios"

export const getShortListedCandidate = async (data) => {
            return await currentBackendAxiosInstance.post("hr_management/shortlisted_candidate/", data)
}

export const getSelectedCandidate = async (data) => {
            return await currentBackendAxiosInstance.post("hr_management/selected_candidate/", data)
}

export const getCandidateApplicationsForHr = async (data) => {
            return await currentBackendAxiosInstance.post("/candidate_management/get_job_application/", data)
}