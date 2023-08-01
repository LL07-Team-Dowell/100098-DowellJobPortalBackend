import { currentBackendAxiosInstance } from "./axios";

export const createThread = async (data) => {
    return await currentBackendAxiosInstance.post(
        "create_thread/",
        data
    );
}