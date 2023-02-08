import { backendAxiosInstance } from "./axios"

export const submitNewApplication = async (data) => {
    return await backendAxiosInstance.post("/jobs/add_application/", data)
}
