import { speedTestAxiosInstance } from "./axios";

export const getInternetSpeedTest = async (email) => {
  return await speedTestAxiosInstance.get(`livinglab/api.php?email=${email}`);
};
