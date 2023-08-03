import { currentBackendAxiosInstance } from "./axios";

export const createThread = async (data) => {
    console.log(data);
    return await currentBackendAxiosInstance.post(
        "create_thread/",
        data
    );
}