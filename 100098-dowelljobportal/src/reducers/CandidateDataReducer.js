export const candidateDataReducerActions = {
    UPDATE_ONBOARDING_CANDIDATES: "update_onboarding_candidates",
    UPDATE_REHIRED_CANDIDATES: "update_rehired_candidates",
    UPDATE_INTERVIEWING_CANDIDATES: "update_interviewing_candidates",
    UPDATE_SELECTED_CANDIDATES: "update_selected_candidates",
    UPDATE_REJECTED_CANDIDATES: "update_rejected_candidates",
    UPDATE_CANDIDATES_TO_HIRE: "update_candidates_to_hire",
}

export const candidateDataReducer = (currentCandidateState, action) => {

    switch (action.type) {

        case candidateDataReducerActions.UPDATE_ONBOARDING_CANDIDATES:
        case candidateDataReducerActions.UPDATE_INTERVIEWING_CANDIDATES:
        case candidateDataReducerActions.UPDATE_REHIRED_CANDIDATES:
        case candidateDataReducerActions.UPDATE_REJECTED_CANDIDATES:
        case candidateDataReducerActions.UPDATE_SELECTED_CANDIDATES:
        case candidateDataReducerActions.UPDATE_CANDIDATES_TO_HIRE:

            if ( !action.payload.stateToChange ) return currentCandidateState;

            if ( action.payload.updateExisting ) return {
                ...currentCandidateState,
                [ action.payload.stateToChange ]: [
                    ...currentCandidateState[`${action.payload.stateToChange}`], 
                    action.payload.value
                ]
            }

            if ( action.payload.removeFromExisting ) return {
                ...currentCandidateState,
                [ action.payload.stateToChange ]: [...currentCandidateState[`${action.payload.stateToChange}`].filter(candidateState => candidateState.id !== action.payload.value.id)]
            }
            
            return { ...currentCandidateState, [ action.payload.stateToChange ]: action.payload.value }
        
        default:
            return currentCandidateState;
        
    }
}
