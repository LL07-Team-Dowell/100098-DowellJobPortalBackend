import { formerBackendAxiosInstance } from "./axios"

export const submitNewApplication = async (data) => {
    return await formerBackendAxiosInstance.post("/jobs/add_application/", data)
}
