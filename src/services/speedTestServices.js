import { currentBackendAxiosInstance } from "./axios";

export const getInternetSpeedTest = async (email) => {
  return await currentBackendAxiosInstance.get(
    `v2/speed_test_result/${email}`
  );
};
