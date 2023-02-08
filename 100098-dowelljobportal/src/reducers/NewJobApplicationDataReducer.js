export const newJobApplicationDataReducerActions = {
    UPDATE_JOB: "update_job",
    UPDATE_APPLICANT: "update_applicant",
    UPDATE_COUNTRY: "update_country",
    UPDATE_FREELANCE_PLATFORM: "update_freelance_platform",
    UPDATE_FREELANCE_PLATFORM_URL: "update_freelance_platform_url",
    UPDATE_AGREE_TO_ALL: "update_agree_to_all",
    UPDATE_QUALIFICATIONS: "update_qualifications",
    UPDATE_COMMENTS: "update_comments",
    UPDATE_OTHERS: "update_others",
    UPDATE_JOB_DESCRIPTION: "update_job_description",
    UPDATE_DATE_APPLIED: "update_date_applied",
    UPDATE_JOB_TITLE: "update_job_title",
    REWRITE_EXISTING_STATE: "rewrite_existing_new_job_state",
    UPDATE_APPLICANT_EMAIL: "update_applicant_email",
    UPDATE_APPLICANT_FIRST_NAME: "update_applicant_first_name",
    UPDATE_APPLICATION_STATUS: "update_application_status",
}

export const newJobApplicationDataReducer = (currentState, action) => {
    switch (action.type) {

        case newJobApplicationDataReducerActions.UPDATE_AGREE_TO_ALL:
        case newJobApplicationDataReducerActions.UPDATE_QUALIFICATIONS:
        case newJobApplicationDataReducerActions.UPDATE_COMMENTS:
        case newJobApplicationDataReducerActions.UPDATE_DATE_APPLIED:
        case newJobApplicationDataReducerActions.UPDATE_OTHERS:
        case newJobApplicationDataReducerActions.UPDATE_APPLICANT_EMAIL:
        case newJobApplicationDataReducerActions.UPDATE_APPLICANT_FIRST_NAME:

            if (!action.payload.stateToChange) return currentState;

            return { 
                ...currentState, others : {
                    ...currentState.others,
                    [ action.payload.stateToChange ]: action.payload.value
                }
            }
        
        case newJobApplicationDataReducerActions.UPDATE_JOB:
        case newJobApplicationDataReducerActions.UPDATE_APPLICANT:
        case newJobApplicationDataReducerActions.UPDATE_COUNTRY:
        case newJobApplicationDataReducerActions.UPDATE_FREELANCE_PLATFORM:
        case newJobApplicationDataReducerActions.UPDATE_FREELANCE_PLATFORM_URL:
        case newJobApplicationDataReducerActions.UPDATE_JOB_TITLE:
        case newJobApplicationDataReducerActions.UPDATE_JOB_DESCRIPTION:
        case newJobApplicationDataReducerActions.UPDATE_APPLICATION_STATUS:

            if (!action.payload.stateToChange) return currentState;

            return { ...currentState, [ action.payload.stateToChange ]: action.payload.value }

        case newJobApplicationDataReducerActions.REWRITE_EXISTING_STATE:
            if (!action.payload.newState) return currentState;

            return action.payload.newState;
    
        default:
            return currentState;
    }
}
