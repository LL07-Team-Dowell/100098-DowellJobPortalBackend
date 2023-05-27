import { currentBackendAxiosInstance } from "./axios";

export const getSettingUserProfileInfo = async () => {
  return await currentBackendAxiosInstance.get(
    "setting/SettingUserProfileInfo/"
  );
};

export const configureSettingUserProfileInfo = async (dataToPost) => {
  return await currentBackendAxiosInstance.post(
    "setting/SettingUserProfileInfo/",
    dataToPost
  );
}
