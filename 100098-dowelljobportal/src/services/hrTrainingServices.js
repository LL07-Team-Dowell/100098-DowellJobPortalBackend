import { currentBackendAxiosInstance } from "./axios";

export const createQuestionForTrainingMangement = async (data) => {
  return await currentBackendAxiosInstance.post(
    "training_management/create_question/",
    data
  );
};
