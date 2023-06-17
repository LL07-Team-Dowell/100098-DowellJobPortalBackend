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
// axios.post("https://100098.pythonanywhere.com/team_task_management/create_team_task/",{assignee:currentUser.userinfo.username
// ,title:data.taskName ,description:data.discription,team:data.teamId , completed:false})
export const createTeamTask = async (data) => {
            return await currentBackendAxiosInstance.post("create_team_task/",data)
}
// axios.patch(`https://100098.pythonanywhere.com/team_task_management/edit_team/${choosedTeam.id}/`,{ "team_name":teamName ,
// "members":data?.membersEditTeam})

export const EditTeam = async (id , data) => { 
            return await currentBackendAxiosInstance.patch(`edit_team/${id}/`,data)
}