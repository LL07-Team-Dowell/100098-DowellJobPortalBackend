import { dowellMailAxiosInstance, mailAxiosInstance } from "./axios"

export const sendMail = async (data) => {
    return await mailAxiosInstance.post("https://formsubmit.co/ajax/" + process.env.REACT_APP_MY_MAIL, data)
}

export const sendMailUsingDowell = async (data) => {
    return await dowellMailAxiosInstance.post('hr-status/', data);
}