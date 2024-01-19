import { useState } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"
import { useCandidateContext } from "../../../../contexts/CandidatesContext";
import AccountPageLayout from "../../layouts/AccountPageLayout";

const AccountsOnboardingPage = () =>  {
    const [searchValue, setSearchValue] = useState("");
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const {
        candidatesData,
        dispatchToCandidatesData,
        candidatesDataLoaded,
        setCandidatesDataLoaded,
    } = useCandidateContext();

    const handleSearch = (value) => {
        setSearchValue(value);
        
        setFilteredCandidates(
            candidatesData.onboardingCandidates.filter((application) =>
              application.applicant
                .toLocaleLowerCase()
                .includes(value.toLocaleLowerCase())
            )
        );
    }
    
    return <>
        <AccountPageLayout
            searchValue={searchValue}
            searchPlaceHolder={'onboarding'}
            handleSearch={handleSearch}
            hideSearchBar={false}
            currentActiveMenuItem={'Onboarding'}
        >

        </AccountPageLayout>
    </>
}

export default AccountsOnboardingPage;