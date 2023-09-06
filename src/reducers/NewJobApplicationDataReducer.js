export const newJobApplicationDataReducerActions = {
    UPDATE_JOB: "update_job",
    UPDATE_APPLICANT: "update_applicant",
    UPDATE_COUNTRY: "update_country",
    UPDATE_INTERNET_SPEED: "update_internet_speed",
    UPDATE_JOB_CATEGORY: "update_job_category",
    UPDATE_FREELANCE_PLATFORM: "update_freelance_platform",
    UPDATE_FREELANCE_PLATFORM_URL: "update_freelance_platform_url",
    UPDATE_AGREE_TO_ALL: "update_agree_to_all_terms",
    UPDATE_PAYMENT: "payment",
    UPDATE_MODULE: "module",
    UPDATE_QUALIFICATIONS: "update_qualifications",
    UPDATE_FEEDBACK: "update_feedback",
    UPDATE_OTHERS: "update_others",
    UPDATE_JOB_DESCRIPTION: "update_job_description",
    UPDATE_DATE_APPLIED: "application_submitted_on",
    UPDATE_JOB_TITLE: "update_job_title",
    REWRITE_EXISTING_STATE: "rewrite_existing_new_job_state",
    UPDATE_APPLICANT_EMAIL: "update_applicant_email",
    UPDATE_APPLICANT_FIRST_NAME: "update_applicant_first_name",
    UPDATE_APPLICATION_STATUS: "update_application_status",
    UPDATE_ACADEMIC_QUALIFICATION: "update_academic_qualification",
    UPDATE_COMPANY_ID: "update_company_id",
    UPDATE_DATA_TYPE: "update_data_type",
    UPDATE_JOB_NUMBER: "update_job_number",
    UPDATE_USERNAME: "update_username",
    // UPDATE_TIME_INTERVAL:"update_time_interval"
    UPDATE_PORTFOLIO_NAME: "update_portfolio_name",
}

export const newJobApplicationDataReducer = (currentState, action) => {
    console.log(currentState);
    switch (action.type) {
        case newJobApplicationDataReducerActions.UPDATE_APPLICANT_FIRST_NAME:
        case newJobApplicationDataReducerActions.UPDATE_OTHERS:
            if (!action.payload.stateToChange) return currentState;
            return {
                ...currentState, other_info: {
                    ...currentState.other_info,
                    [action.payload.stateToChange]: action.payload.value
                }
            }
        case newJobApplicationDataReducerActions.UPDATE_USERNAME:
        case newJobApplicationDataReducerActions.UPDATE_PAYMENT:
        case newJobApplicationDataReducerActions.UPDATE_MODULE:
        case newJobApplicationDataReducerActions.UPDATE_JOB_NUMBER:
        case newJobApplicationDataReducerActions.UPDATE_DATA_TYPE:
        case newJobApplicationDataReducerActions.UPDATE_COMPANY_ID:
        case newJobApplicationDataReducerActions.UPDATE_DATE_APPLIED:
        case newJobApplicationDataReducerActions.UPDATE_APPLICANT_EMAIL:
        case newJobApplicationDataReducerActions.UPDATE_ACADEMIC_QUALIFICATION:
        case newJobApplicationDataReducerActions.UPDATE_QUALIFICATIONS:
        case newJobApplicationDataReducerActions.UPDATE_AGREE_TO_ALL:
        case newJobApplicationDataReducerActions.UPDATE_FEEDBACK:
        case newJobApplicationDataReducerActions.UPDATE_JOB:
        case newJobApplicationDataReducerActions.UPDATE_APPLICANT:
        case newJobApplicationDataReducerActions.UPDATE_COUNTRY:
        case newJobApplicationDataReducerActions.UPDATE_FREELANCE_PLATFORM:
        case newJobApplicationDataReducerActions.UPDATE_FREELANCE_PLATFORM_URL:
        case newJobApplicationDataReducerActions.UPDATE_JOB_TITLE:
        case newJobApplicationDataReducerActions.UPDATE_JOB_DESCRIPTION:
        case newJobApplicationDataReducerActions.UPDATE_APPLICATION_STATUS:
        case newJobApplicationDataReducerActions.UPDATE_INTERNET_SPEED:
        case newJobApplicationDataReducerActions.UPDATE_JOB_CATEGORY:
        case newJobApplicationDataReducerActions.UPDATE_PORTFOLIO_NAME:

            if (!action.payload.stateToChange) return currentState;

            return { ...currentState, [action.payload.stateToChange]: action.payload.value }

        case newJobApplicationDataReducerActions.REWRITE_EXISTING_STATE:
            if (!action.payload.newState) return currentState;

            return action.payload.newState;

        default:
            return currentState;
    }
}
