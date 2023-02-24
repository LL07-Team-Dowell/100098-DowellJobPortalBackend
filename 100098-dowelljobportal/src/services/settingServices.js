import { currentBackendAxiosInstance } from "./axios";

export const getSettingUserProfileInfo = async () => {
  return await currentBackendAxiosInstance.get(
    "setting/SettingUserProfileInfo/"
  );
};
