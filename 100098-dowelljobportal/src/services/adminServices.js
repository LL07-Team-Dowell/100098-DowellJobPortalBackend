import { currentBackendAxiosInstance } from "./axios"

export const addNewJob = async (data) =>{
            await currentBackendAxiosInstance.post(
                        "admin_management/get_jobs/" , 
                        data
            )
}