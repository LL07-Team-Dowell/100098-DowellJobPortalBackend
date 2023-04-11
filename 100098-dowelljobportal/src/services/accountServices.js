import { currentBackendAxiosInstance } from "./axios";

export const managementOnboardingCanditate = async (data) => {
  return await currentBackendAxiosInstance.post(
    "accounts_management/onboard_candidate/",
    data
  );
};

export const managementUpdateProject = async (data) => {
  return await currentBackendAxiosInstance.post(
    "accounts_management/update_project/",
    data
  );
};

export const managementRejectProject = async(data)=>{
  return await currentBackendAxiosInstance.post(
    "accounts_management/reject_candidate/",
    data
  )
}

export const managementReHireCanditate = async (data) => {
  return await currentBackendAxiosInstance.post(
    "accounts_management/rehire_candidate/",
    data
  );
};
