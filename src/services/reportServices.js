import { currentBackendAxiosInstance } from "./axios";

export const generateTaskReport = async (dataToPost) => {
  return await currentBackendAxiosInstance.post(
    "generate_project_Report/",
    dataToPost
  );
};
