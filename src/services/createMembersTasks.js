import axios from "axios"
import { currentBackendAxiosInstance } from "./axios"

export const rejectCandidateApplicationforHr = async (data) => {
    return await currentBackendAxiosInstance.post("hr_management/reject_candidate/", data)
}

export const createTeam = async (data) => {
            return await currentBackendAxiosInstance.post("create_team/",data)
}

export const getAllTeams = async (id) => {
            return await currentBackendAxiosInstance.get(`get_all_teams/${id}/`) ; 
}
export const createTeamTask = async (data) => {
            return await currentBackendAxiosInstance.post("create_team_task/",data)
}

export const EditTeam = async (id , data) => { 
            return await currentBackendAxiosInstance.patch(`edit_team/${id}/`,data)
}
export const deleteTeam = async (id) => { 
    return await currentBackendAxiosInstance.delete(`/delete_team/${id}/`)
}