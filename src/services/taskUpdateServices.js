import { currentBackendAxiosInstance } from "./axios";

export const getAllUpdateTask = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `get_all_update_task/${company_id}/`
  );
};

export const approveLogRequest = async (id) => {
  return await currentBackendAxiosInstance.patch(
    `get_all_update_task/${id}`
  );
};

export const denyLogRequest = async ( id, data) => {
  return await currentBackendAxiosInstance.patch(
    `get_all_update_task/${id}`,
    data
  );
};
