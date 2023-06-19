import { currentBackendAxiosInstance } from "./axios";

export const createQuestionForTrainingMangement = async (dataToPost) => {
  const response = await currentBackendAxiosInstance.post(
    "create_question/",
    dataToPost
  );
  return response;
};

export const getTrainingManagementQuestions = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `get_all_question/${company_id}/`
  );
};

export const editTrainingManagementQuestion = async (data) => {
  return await currentBackendAxiosInstance.patch(
    'update_question/',
    data
  )
}
// export const createTrainingManagementResponse = async (data) => {
//   return await currentBackendAxiosInstance.post(
//     "training_management/create_response/" , data
//   )
// }
export const createTrainingManagementResponse = async (data) => {
  return await currentBackendAxiosInstance.post(
    "create_response/" , data
  )
}