import { currentBackendAxiosInstance } from "./axios";

export const getAllUpdateTask = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `get_all_update_task/${company_id}/`
  );
};

export const approveLogRequest = async (document_id, data) => {
  return await currentBackendAxiosInstance.patch(
    `approve_task_update_request/${document_id}/`,
    data
  );
};

export const denyLogRequest = async (document_id, data) => {
  return await currentBackendAxiosInstance.patch(
    `denied_task_update_request/${document_id}/`,
    data
  );
};
