import { mailAxiosInstance } from "./axios"

export const sendMail = async (data) => {
    return await mailAxiosInstance.post("https://formsubmit.co/ajax/" + process.env.REACT_APP_MY_MAIL, data)
}
