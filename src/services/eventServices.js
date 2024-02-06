import { currentBackendAxiosInstance } from "./axios";

export const getAllEvents = async (data) => {
  return await currentBackendAxiosInstance.post(
    `events/?type=GetAllEvents`,
    data
  );
};

export const addEvents = async (data) => {
  return await currentBackendAxiosInstance.post(
    `events/?type=add_events`,
    data
  );
};

export const updateEvents = async (data) => {
  return await currentBackendAxiosInstance.post(
    `events/?type=update_events`,
    data
  );
};
