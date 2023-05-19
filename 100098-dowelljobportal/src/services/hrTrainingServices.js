import { currentBackendAxiosInstance } from "./axios";

export const createQuestionForTrainingMangement = async (dataToPost) => {
  const response = await currentBackendAxiosInstance.post(
    "training_management/create_question/",
    dataToPost
  );
  return response;
};

export const getTrainingManagementQuestions = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `training_management/get_all_question/${company_id}/`
  );
};

export const editTrainingManagementQuestion = async (data) => {
  return await currentBackendAxiosInstance.patch(
    'training_management/update_question/',
    data
  )
}