import { currentBackendAxiosInstance } from "./axios";

export const managementOnboardingCanditate = async (data) => {
  return await currentBackendAxiosInstance.post(
    "accounts_onboard_candidate/",
    data
  );
};

export const managementUpdateProject = async (data) => {
  return await currentBackendAxiosInstance.patch(
    "accounts_update_project/",
    data
  );
};

export const managementRejectProject = async (data) => {
  return await currentBackendAxiosInstance.post(
    "accounts_reject_candidate/",
    data
  )
}

export const managementReHireCanditate = async (data) => {
  return await currentBackendAxiosInstance.post(
    "accounts_rehire_candidate/",
    data
  );
};
