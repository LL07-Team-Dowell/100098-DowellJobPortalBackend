import { currentBackendAxiosInstance } from "./axios";

export const getSettingUserProfileInfo = async () => {
  return await currentBackendAxiosInstance.get(
    "settinguserprofileinfo/"
  );
};

export const configureSettingUserProfileInfo = async (dataToPost) => {
  return await currentBackendAxiosInstance.post(
    "settinguserprofileinfo/",
    dataToPost
  );
}
