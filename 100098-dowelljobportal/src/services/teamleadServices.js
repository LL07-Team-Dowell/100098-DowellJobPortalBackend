import { currentBackendAxiosInstance } from "./axios";

export const hireCandidate = async (data) => {
  return await currentBackendAxiosInstance.post(
    "lead_management/hire_candidate/",
    data
  );
};

export const reHireCandidate = async (data) => {
  return await currentBackendAxiosInstance.post(
    "lead_management/rehire_candidate/",
    data
  );
};
