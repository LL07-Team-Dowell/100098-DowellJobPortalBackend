import axios from "axios";

const formerbaseURL = "https://100055.pythonanywhere.com/api/";
const loginBaseURL = "https://100014.pythonanywhere.com/api/";
const loginBaseURL2 = "https://100093.pythonanywhere.com/api/";
const communityBaseURL = "https://100081.pythonanywhere.com/mainapp/";
const locationBaseURL = "https://100074.pythonanywhere.com/";
const currentBaseURL = "https://100098.pythonanywhere.com/";
const loginStaticBaseURL = "https://100014.pythonanywhere.com/";
const dowellLoginUrl =
  "https://100014.pythonanywhere.com/?redirect_url=" +
  window.location.origin +
  "/100098-DowellJobPortal/%23";
const dowellLogoutUrl =
  "https://100014.pythonanywhere.com/sign-out?redirect_url=" +
  window.location.origin +
  "/100098-DowellJobPortal/%23";
const dowellMailApiBaseUrl = "https://100085.pythonanywhere.com/api/";
const dowellTimeBaseUrl = "https://100009.pythonanywhere.com/";
const internetSpeedTestUrl = "https://dowellresearch.com/";
const workFlowUrl = "https://100094.pythonanywhere.com/v2/";

const formerBackendAxiosInstance = axios.create({
  withCredentials: true,
  baseURL: formerbaseURL,
});
const workFlowAxiosInstance = axios.create({
  baseURL: workFlowUrl,
});

const speedTestAxiosInstance = axios.create({
  // withCredentials: true,
  baseURL: internetSpeedTestUrl,
});

const authAxiosInstance = axios.create({
  withCredentials: true,
  baseURL: loginBaseURL,
});

const otherAuthAxiosInstance = axios.create({
  withCredentials: true,
  baseURL: loginBaseURL2,
});

const mailAxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

const communityAxiosInstance = axios.create({
  baseURL: communityBaseURL,
});

const locationAxiosInstance = axios.create({
  baseURL: locationBaseURL,
  withCredentials: true,
});

const currentBackendAxiosInstance = axios.create({
  baseURL: currentBaseURL,
  // withCredentials: true,
});
currentBackendAxiosInstance.interceptors.request.use(
  (config) => {
    const copyOfConfigHeaders = structuredClone(config.headers);
    config.headers = {
      ...copyOfConfigHeaders,
      Authorization: sessionStorage.getItem("token"),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const liveStatusBackendAxiosInstance = axios.create({
  baseURL: loginStaticBaseURL,
});

const dowellMailAxiosInstance = axios.create({
  baseURL: dowellMailApiBaseUrl,
});

const dowellTimeAxiosInstance = axios.create({
  baseURL: dowellTimeBaseUrl,
});

export {
  authAxiosInstance,
  otherAuthAxiosInstance,
  formerBackendAxiosInstance,
  dowellLoginUrl,
  dowellLogoutUrl,
  mailAxiosInstance,
  communityAxiosInstance,
  locationAxiosInstance,
  currentBackendAxiosInstance,
  liveStatusBackendAxiosInstance,
  dowellMailAxiosInstance,
  dowellTimeAxiosInstance,
  speedTestAxiosInstance,
  workFlowAxiosInstance,
};
