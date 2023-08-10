import { currentBackendAxiosInstance } from "./axios";

export const createThread = async (data) => {
    console.log(data);
    return await currentBackendAxiosInstance.post(
        "create_thread/",
        data
    );
}

export const fetchThread = async(document_id)=>{
  return await currentBackendAxiosInstance.get(
    `fetch_team_thread/${document_id}/`
  )
}

export const postComment = async(data)=>{
  return await currentBackendAxiosInstance.post(
    "create_comment/",
    data
  )
}

export const featchAllComment = async (data) => {
  return await currentBackendAxiosInstance.get("fetch_comment/", data );
};

export const updateComment = async(data)=>{
  return await currentBackendAxiosInstance.patch(
    "update_comment/",
    data
  )
}