import { authAxiosInstance, otherAuthAxiosInstance } from "./axios"

export const getUserInfoFromLoginAPI = async (data) => {
    return await authAxiosInstance.post("userinfo/", data)
}

export const getUserInfoFromPortfolioAPI = async (data) => {
    return await otherAuthAxiosInstance.post("userinfo/", data)
}

export const getUserDetails = async (data) => {
    return await authAxiosInstance.post("hruser/", data)
}

export const getRolesInOrganization = async (orgId) => {
    return await otherAuthAxiosInstance.get(`get_roles/${orgId}`)
}