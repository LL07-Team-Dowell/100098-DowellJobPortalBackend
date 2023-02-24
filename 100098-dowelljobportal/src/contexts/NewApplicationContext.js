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
    usernames: "",
    data_type: "",
    payment: "",
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
]

export const mutableNewApplicationStateNames = {
    job: "job",
    applicant: "applicant",
    title: "title",
    country: "country",
    freelancePlatform: "freelancePlatform",
    freelancePlatformUrl: "freelancePlatformUrl",
    jobDescription: "description",
    others_property_agreeToAll: "agreeToAllTerms",
    others_property_qualification_type: "academic_qualification_type",
    others_property_qualification: "academic_qualification",
    others_comments: "comments",
    others_date_applied: "date_applied",
    others_team_lead_remarks: "team_lead_remarks",
    others_applicant_email: "applicant_email",
    others_applicant_first_name: "applicant_first_name",
    hr_remarks: "hr_remarks",
    hr_discord_link: "hr_discord_link",
    assigned_project: "assigned_project",
    status: "status",
    others_scheduled_interview_date: "scheduled_interview_date"
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
            { children }
        </NewApplicationContext.Provider>
    )
}