import { createContext, useContext, useReducer } from "react";
import { newJobApplicationDataReducer } from "../reducers/NewJobApplicationDataReducer";

const NewApplicationContext = createContext({});

export const newApplicationState = {
    job_number: "",
    job_title: "",
    job_category:"",
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
    agree_to_all_terms: false,
    company_id: "",
    data_type: "",
    payment: "",
    module:"",
    // time_interval: "",
    application_submitted_on: "",
    portfolio_name: "",
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
  "job_category",
  "portfolio_name",
];

export const mutableNewApplicationStateNames = {
    _id: "_id",
    applicant: "applicant",
    job_title: "job_title",
    job_number: "job_number",
    job_category:"job_category",
    payment: "payment",
    module:"module",
    country: "country",
    internet_speed:"internet_speed",
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
    data_type: "data_type",
    portfolio_name: "portfolio_name",
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