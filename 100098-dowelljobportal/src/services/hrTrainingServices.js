import { currentBackendAxiosInstance } from "./axios";

export const createQuestionForTrainingMangement = async (dataToPost) => {
  const response = await currentBackendAxiosInstance.post(
    "training_management/create_question/",
    dataToPost
  );
  return response;
};
