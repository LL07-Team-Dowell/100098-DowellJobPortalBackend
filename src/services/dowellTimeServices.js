import { dowellTimeAxiosInstance } from "./axios"

export const getCurrentTimeFromDowell = async (data) => {
    return await dowellTimeAxiosInstance.post('/dowellclock/', data);
}
