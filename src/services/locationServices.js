import { locationAxiosInstance } from "./axios";

export const getContinents = async () => {
  return await locationAxiosInstance.get(
    "/continents/johnDoe123/haikalsb1234/100074/?format=json"
  );
};

export const getRegion = async (countryName) => {
  return await locationAxiosInstance.get(
    `region/name/${countryName}/johnDoe123/haikalsb1234/100074/`
  );
};
