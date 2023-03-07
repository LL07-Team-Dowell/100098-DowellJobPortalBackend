import { createContext, useContext, useReducer } from "react";
import { newJobApplicationDataReducer } from "../reducers/NewJobApplicationDataReducer";

const NewApplicationContext = createContext({});

export const newApplicationState = {
    job_number: "",
    job_title: "",
    applicant: "",
    applicant_email: "",
    feedBack: "",
    freelancePlatform: "",
    freelancePlatformUrl: "",
    academic_qualification_type: "",
    academic_qualification: "",
    country: "",
    internet_speed: "",
    other_info: [],
    agree_to_all_terms: "False",
    company_id: "",
    data_type: "",
    payment: "",
    // time_interval: "",
    application_submitted_on: ""
}

export const excludedApplicantInfo = [
    "feedBack",
    "hr_remarks",
    "status",
    "job",
    "id",
    "team_lead_remarks",
    "date_applied",
    "jobDescription",
    "agreeToAllTerms",
    "created",
    "updated",
    "hr_discord_link",
    "assigned_project",
    "scheduled_interview_date",
    "paymentForJob",
    "othersInternJobType",
    "othersResearchAssociateJobType",
    "othersFreelancerJobType",
    "server_discord_link",
]

export const mutableNewApplicationStateNames = {
    _id: "_id",
    applicant: "applicant",
    job_title: "job_title",
    job_number: "job_number",
    payment: "payment",
    country: "country",
    username: "username",
    freelancePlatform: "freelancePlatform",
    freelancePlatformUrl: "freelancePlatformUrl",
    jobDescription: "description",
    agree_to_all_terms: "agree_to_all_terms",
    academic_qualification_type: "academic_qualification_type",
    academic_qualification: "academic_qualification",
    feedBack: "feedBack",
    application_submitted_on: "application_submitted_on",
    others_team_lead_remarks: "team_lead_remarks",
    others_applicant_email: "applicant_email",
    others_applicant_first_name: "applicant_first_name",
    hr_remarks: "hr_remarks",
    hr_discord_link: "hr_discord_link",
    assigned_project: "assigned_project",
    status: "status",
    others_scheduled_interview_date: "scheduled_interview_date",
    company_id: "company_id",
    // time_interval: "time_interval",
    data_type: "data_type"
}

export const useNewApplicationContext = () => useContext(NewApplicationContext);

export const NewApplicationContextProvider = ({ children }) => {

    const [newApplicationData, dispatchToNewApplicationData] = useReducer(newJobApplicationDataReducer, newApplicationState);

    const newApplicationContextData = {
        newApplicationData: newApplicationData,
        dispatchToNewApplicationData: dispatchToNewApplicationData,
    }

    return (
        <NewApplicationContext.Provider value={newApplicationContextData} >
            {children}
        </NewApplicationContext.Provider>
    )
}