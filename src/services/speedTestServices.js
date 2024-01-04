import { currentBackendAxiosInstance } from "./axios";

export const getInternetSpeedTest = async (email) => {
  return await currentBackendAxiosInstance.get(
    `speed_test_result/${email}`
  );
};
