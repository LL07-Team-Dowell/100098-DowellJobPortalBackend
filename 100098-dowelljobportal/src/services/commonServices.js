import { backendAxiosInstance } from "./axios"

export const getJobs = async () => {
    return await backendAxiosInstance.get("/jobs/get_jobs/");
}

export const getCandidateApplications = async () => {
    return await backendAxiosInstance.get("/jobs/get_applications/");
}

export const getAllCandidateInterviews = async () => {
    return await backendAxiosInstance.get("/jobs/meeting/");
}

export const fetchCandidateTasks = async () => {
    return await backendAxiosInstance.get("/jobs/get_tasks/")
}

export const getProjects = async () => {
    return await backendAxiosInstance.get("/jobs/project/");
}

export const updateSingleTask = async (taskIdToUpdate, dataToPost) => {
    return await backendAxiosInstance.post("/jobs/update_task/" + taskIdToUpdate, dataToPost)
}

export const addNewTask = async (data) => {
    return await backendAxiosInstance.post("/jobs/add_new_task/", data)
}

export const updateCandidateApplication = async (applicationId, data) => {
    return await backendAxiosInstance.post("/jobs/update_application/" + applicationId + "/", data)
}