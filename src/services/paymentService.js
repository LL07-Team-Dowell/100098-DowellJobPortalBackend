import { currentBackendAxiosInstance, workFlowAxiosInstance } from "./axios";

export const getLogsBetweenRange = async (data) => {
  return await currentBackendAxiosInstance.post(
    `task_module/?type=task_details`,
    data
  );
};

export const getleaveDays = async (userId) => {
  return await currentBackendAxiosInstance.post(
    `candidate_leave_apply/?type=get_user_leave&user_id=${userId}&limit=0&offset=0`
  );
};

export const processPayment = async (data) => {
  return await currentBackendAxiosInstance.post(
    `invoice_module/?type=process-payment`,
    data
  );
};

export const getInvoice = async (userID, year, month) => {
  return await currentBackendAxiosInstance.get(
    `invoice_module/?type=get-invoice&user_id=${userID}&payment_year=${year}&payment_month=${month}`
  );
};

export const workFlowdetails = async (data) => {
  return await workFlowAxiosInstance.post(`processes/invoice/`, data);
};
