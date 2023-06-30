import { useEffect, useRef, useState } from "react";
import { BsStopCircle } from "react-icons/bs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ApplicantDetails from "../../components/ApplicationDetails/ApplicationDetails";
import AssignedProjectDetails from "../../components/AssignedProjectDetails/AssignedProjectDetails";
import { AiOutlineCloseCircle } from "react-icons/ai";
import PaymentDetails from "../../../AccountPage/components/PaymentDetails/PaymentDetails";
import "./style.css";
import { accountPageActions } from "../../../AccountPage/actions/AccountActions";
import { candidateDataReducerActions } from "../../../../reducers/CandidateDataReducer";
import { initialCandidatesDataStateNames } from "../../../../contexts/CandidatesContext";
import { hrPageActions } from "../../../HrPage/actions/HrActions";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import { useNavigate } from "react-router-dom";
import { teamLeadActions } from "../../actions/TeamLeadActions";
import { mutableNewApplicationStateNames } from "../../../../contexts/NewApplicationContext";
import {
  changeToTitleCase,
  formatDateAndTime,
  validateUrl,
} from "../../../../helpers/helpers";
import { toast } from "react-toastify";
import { sendMail } from "../../../../services/mailServices";
import { dowellLoginUrl } from "../../../../services/axios";
import { getUserDetails } from "../../../../services/authServices";
import {
  addSelectedCandidate,
  changeCandidateStatusToShortlisted,
  rejectCandidateApplicationforHr,
} from "../../../../services/hrServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import {
  leadHireCandidate,
  leadReHireCandidate,
  rejectCandidateApplicationForTeamLead,
} from "../../../../services/teamleadServices";
import {
  managementOnboardingCanditate,
  managementReHireCanditate,
  managementRejectProject,
} from "../../../../services/accountServices";
import { configureSettingUserProfileInfo } from "../../../../services/settingServices";

const SelectedCandidatesScreen = ({
  selectedCandidateData,
  updateCandidateData,
  allCandidatesData,
  rehireTabActive,
  accountPage,
  hireTabActive,
  showOnboarding,
  updateShowCandidate,
  hrPageActive,
  initialMeet,
  jobTitle,
  teamleadPageActive,
  showApplicationDetails,
  handleViewApplicationBtnClick,
  availableProjects,
  updateAppliedData,
  guestApplication,
}) => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const [remarks, setRemarks] = useState("");
  const [hrDiscordLink, setHrDiscordLink] = useState("");
  const [candidatePlatform, setCandidatePlatform] = useState("");
  const [assignedProject, setAssignedProject] = useState("Hr Hiring");
  const [interviewDate, setInterviewDate] = useState("");
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    setCandidatePlatform(
      selectedCandidateData[mutableNewApplicationStateNames.freelancePlatform]
    );
  }, []);

  const handleClick = async (ref, disableOtherBtns, action) => {
    if (!ref.current) return;

    if (action === hrPageActions.MOVE_TO_PENDING && interviewDate === "")
      return toast.info("Please set an interview date for the candidate");

    disableOtherBtns && setDisabled(true);

    ref.current.classList.toggle("active");

    // if (action === hrPageActions.MOVE_TO_SHORTLISTED) {

    //     try {

    //         const res = await getUserDetails({ username: selectedCandidateData[mutableNewApplicationStateNames.applicant] })

    //         if (res.data.username === "") {
    //             disableOtherBtns && setDisabled(false);
    //             ref.current.classList.toggle("active");
    //             return toast.info("Candidate has no active account.")
    //         }

    //         if (res.data.role === process.env.REACT_APP_GUEST_ROLE) {
    //             disableOtherBtns && setDisabled(false);
    //             ref.current.classList.toggle("active");
    //             return toast.info("Candidate has not yet done full signup.")
    //         };

    //     } catch (err) {
    //         disableOtherBtns && setDisabled(false);
    //         ref.current.classList.toggle("active");
    //         return toast.error("Something went wrong went trying to fetch details of current user.")
    //     }

    // }

    switch (action) {
      case accountPageActions.MOVE_TO_ONBOARDING:
        if (!selectedCandidateData) return;

        if (accountPage && rehireTabActive) {
          updateCandidateData({
            type: candidateDataReducerActions.UPDATE_REHIRED_CANDIDATES,
            payload: {
              stateToChange: initialCandidatesDataStateNames.candidatesToRehire,
              value: allCandidatesData.filter(
                (candidate) => candidate._id !== selectedCandidateData._id
              ),
            },
          });
        }

        await managementOnboardingCanditate({
          document_id: selectedCandidateData["_id"],
          applicant: selectedCandidateData.applicant,
          project: [assignedProject],
          task: "Will be assigned by management",
          status: candidateStatuses.ONBOARDING,
          company_id: currentUser.portfolio_info[0].org_id,
          data_type: currentUser.portfolio_info[0].data_type,
          onboarded_on: new Date(),
        });

        updateCandidateData({
          type: candidateDataReducerActions.UPDATE_CANDIDATES_TO_HIRE,
          payload: {
            removeFromExisting: true,
            stateToChange: initialCandidatesDataStateNames.candidatesToHire,
            value: selectedCandidateData,
          },
        });

        selectedCandidateData[
          mutableNewApplicationStateNames.freelancePlatform
        ] = candidatePlatform;

        updateCandidateData({
          type: candidateDataReducerActions.UPDATE_ONBOARDING_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.onboardingCandidates,
            updateExisting: true,
            value: selectedCandidateData,
          },
        });

        return updateShowCandidate(false);

      case accountPageActions.MOVE_TO_REHIRE:
        updateCandidateData({
          type: candidateDataReducerActions.UPDATE_ONBOARDING_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.onboardingCandidates,
            value: allCandidatesData.filter(
              (candidate) => candidate._id !== selectedCandidateData._id
            ),
          },
        });

        updateCandidateData({
          type: candidateDataReducerActions.UPDATE_REHIRED_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.candidatesToRehire,
            updateExisting: true,
            value: selectedCandidateData,
          },
        });

        await managementReHireCanditate({
          document_id: selectedCandidateData["_id"],
          status: candidateStatuses.TO_REHIRE,
        });

        return updateShowCandidate(false);

      case accountPageActions.MOVE_TO_REJECTED:
        if (!selectedCandidateData) return;

        updateCandidateData({
          type: candidateDataReducerActions.UPDATE_REJECTED_CANDIDATES,
          payload: {
            stateToChange: initialCandidatesDataStateNames.rejectedCandidates,
            updateExisting: true,
            value: selectedCandidateData,
          },
        });

        updateCandidateData({
          type: candidateDataReducerActions.UPDATE_CANDIDATES_TO_HIRE,
          payload: {
            removeFromExisting: true,
            stateToChange: initialCandidatesDataStateNames.candidatesToHire,
            value: selectedCandidateData,
          },
        });

        updateCandidateData({
          type: candidateDataReducerActions.UPDATE_REHIRED_CANDIDATES,
          payload: {
            removeFromExisting: true,
            stateToChange: initialCandidatesDataStateNames.candidatesToRehire,
            value: selectedCandidateData,
          },
        });

        updateCandidateData({
          type: candidateDataReducerActions.UPDATE_SELECTED_CANDIDATES,
          payload: {
            removeFromExisting: true,
            stateToChange: initialCandidatesDataStateNames.selectedCandidates,
            value: selectedCandidateData,
          },
        });

        updateCandidateData({
          type: candidateDataReducerActions.UPDATE_ONBOARDING_CANDIDATES,
          payload: {
            removeFromExisting: true,
            stateToChange: initialCandidatesDataStateNames.onboardingCandidates,
            value: selectedCandidateData,
          },
        });

        const data = {
          document_id: selectedCandidateData._id,
          reject_remarks: remarks,
          applicant: selectedCandidateData.applicant,
          username: selectedCandidateData.username,
          company_id: currentUser.portfolio_info[0].org_id,
          data_type: currentUser.portfolio_info[0].data_type,
          rejected_on: new Date(),
        };

        //Rejection Function For Account page
        Promise.all([
          managementRejectProject(data),
          configureSettingUserProfileInfo({
            company_id: currentUser.portfolio_info[0].org_id,
            org_name: currentUser.portfolio_info[0].org_name,
            owner: currentUser.userinfo.username,
            data_type: currentUser.portfolio_info[0].data_type,
            profile_info: [
              {
                profile_title: selectedCandidateData.portfolio_name,
                Role: "Viewer",
                version: "1.0",
                // project: selectedCandidateData.project,
              },
            ],
          }),
        ])
          .then((resp) => console.log(resp))
          .catch((error) => console.log(error));

        return updateShowCandidate(false);

      case teamLeadActions.MOVE_TO_HIRED:
        if (!selectedCandidateData) return;

        if (remarks.length < 1) {
          disableOtherBtns && setDisabled(false);
          ref.current.classList.toggle("active");

          return toast.info(
            `Please add remarks for ${selectedCandidateData.applicant}`
          );
        }

        const dataToPost = {
          document_id: selectedCandidateData["_id"],
          teamlead_remarks: remarks,
          status: candidateStatuses.TEAMLEAD_HIRE,
          applicant: selectedCandidateData.applicant,
          company_id: currentUser.portfolio_info[0].org_id,
          data_type: currentUser.portfolio_info[0].data_type,
          hired_on: new Date(),
        };

        await leadHireCandidate(dataToPost);
        // console.log("dataToPost", dataToPost);

        updateCandidateData({
          type: candidateDataReducerActions.UPDATE_SELECTED_CANDIDATES,
          payload: {
            removeFromExisting: true,
            stateToChange: initialCandidatesDataStateNames.selectedCandidates,
            value: selectedCandidateData,
          },
        });

        return updateShowCandidate(false);

      case teamLeadActions.MOVE_TO_REHIRE:
        selectedCandidateData.status = candidateStatuses.TEAMLEAD_TOREHIRE;

        if (remarks.length < 1) {
          disableOtherBtns && setDisabled(false);
          ref.current.classList.toggle("active");

          return toast.info(
            `Please add remarks for candidate ${selectedCandidateData.applicant}`
          );
        }

        const dataToPost2 = {
          document_id: selectedCandidateData["_id"],
          rehire_remarks: remarks,
        };

        await leadReHireCandidate(dataToPost2);

        return updateShowCandidate(false);

      case teamLeadActions.MOVE_TO_REJECTED:
        if (!selectedCandidateData) return;

        //Rejection Function For teamlead
        Promise.all([
          rejectCandidateApplicationForTeamLead(data),
          configureSettingUserProfileInfo({
            company_id: currentUser.portfolio_info[0].org_id,
            org_name: currentUser.portfolio_info[0].org_name,
            owner: currentUser.userinfo.username,
            data_type: currentUser.portfolio_info[0].data_type,
            profile_info: [
              {
                profile_title: selectedCandidateData.portfolio_name,
                Role: "Viewer",
                version: "1.0",
                // project: selectedCandidateData.project,
              },
            ],
          }),
        ])
          .then((resp) => console.log(resp))
          .catch((error) => console.log(error));

        updateCandidateData((prevCandidates) => {
          return prevCandidates.filter(
            (candidate) => candidate.id !== selectedCandidateData.id
          );
        });

        return navigate("/shortlisted");

      case hrPageActions.MOVE_TO_SHORTLISTED:
        if (!selectedCandidateData) return;

        if (remarks.length < 1) {
          disableOtherBtns && setDisabled(false);
          ref.current.classList.toggle("active");

          return toast.info("Please add remarks for candidate");
        }
        selectedCandidateData.hr_remarks = remarks;
        const testData = {
          hr_remarks: remarks,
          status: candidateStatuses.SHORTLISTED,
          applicant: selectedCandidateData.applicant,
          shortlisted_on: new Date(),
          company_id: currentUser.portfolio_info[0].org_id,
          data_type: currentUser.portfolio_info[0].data_type,
          document_id: selectedCandidateData["_id"],
          // company_name: currentUser.portfolio_info[0].org_name,
          // user_type: currentUser.userinfo.User_type,
        };
        await changeCandidateStatusToShortlisted(testData);

        updateCandidateData((prevCandidates) => {
          return [...prevCandidates, selectedCandidateData];
        });
        updateAppliedData((prevAppliedCandidates) => {
          return prevAppliedCandidates.filter(
            (application) => application._id !== selectedCandidateData._id
          );
        });

        return navigate("/shortlisted");

      case hrPageActions.MOVE_TO_SELECTED:
        if (!selectedCandidateData) return;

        if (hrDiscordLink.length < 1) {
          disableOtherBtns && setDisabled(false);
          ref.current.classList.toggle("active");

          return toast.info("Please add discord link for candidate");
        }

        if (hrDiscordLink.length >= 1) {
          disableOtherBtns && setDisabled(false);
          const urlPattern =
            /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
          const isValidUrl = validateUrl(hrDiscordLink);
          ref.current.classList.toggle("active");
          if (!isValidUrl) {
            setHrDiscordLink("");
            return toast.info("Please add valid discord link for candidate");
          }
        }

        const selectData = {
          document_id: selectedCandidateData["_id"],
          hr_remarks: selectedCandidateData.hr_remarks,
          status: candidateStatuses.SELECTED,
          project: [assignedProject],
          product_discord_link: hrDiscordLink,
          applicant: selectedCandidateData.applicant,
          company_id: currentUser.portfolio_info[0].org_id,
          data_type: currentUser.portfolio_info[0].data_type,
          // company_name: currentUser.portfolio_info[0].org_name,
          // user_type: currentUser.userinfo.User_type,
          selected_on: new Date(),
        };
        await addSelectedCandidate(selectData);

        updateCandidateData((prevCandidates) => {
          return prevCandidates.filter(
            (candidate) => candidate["_id"] !== selectedCandidateData["_id"]
          );
        });

        return navigate("/shortlisted");

      case hrPageActions.MOVE_TO_REJECTED:
        if (!selectedCandidateData) return;

        //Rejection Function For HR
        Promise.all([
          rejectCandidateApplicationforHr(data),
          configureSettingUserProfileInfo({
            company_id: currentUser.portfolio_info[0].org_id,
            org_name: currentUser.portfolio_info[0].org_name,
            owner: currentUser.userinfo.username,
            data_type: currentUser.portfolio_info[0].data_type,
            profile_info: [
              {
                profile_title: selectedCandidateData.portfolio_name,
                Role: "Viewer",
                version: "1.0",
                // project: selectedCandidateData.project,
              },
            ],
          }),
        ])
          .then((resp) => console.log(resp))
          .catch((error) => console.log(error));

        updateCandidateData((prevCandidates) => {
          return prevCandidates.filter(
            (candidate) => candidate.id !== selectedCandidateData.id
          );
        });

        return navigate("/shortlisted");

      case hrPageActions.MOVE_TO_PENDING:
        if (!selectedCandidateData) return;

        // selectedCandidateData[mutableNewApplicationStateNames.hr_remarks] = remarks;

        let newFormData = new FormData();

        newFormData.append(
          "_subject",
          "Finish your job application on Dowell!"
        );
        newFormData.append(
          "email",
          selectedCandidateData.others[
            mutableNewApplicationStateNames.others_applicant_email
          ]
        );
        newFormData.append(
          "message",
          `Please use this link ${new URL(
            `${dowellLoginUrl}register`
          )} to complete your application for the '${jobTitle}' job before ${formatDateAndTime(
            interviewDate
          )}.\nYour username is ${
            selectedCandidateData[mutableNewApplicationStateNames.applicant]
          }`
        );

        const mailResponseStatus = await (await sendMail(newFormData)).status;

        if (mailResponseStatus !== 200)
          return toast.error(
            "An error occurred while trying to send the mail to the applicant"
          );

        // await updateCandidateApplication(selectedCandidateData.id, {
        //   applicant: selectedCandidateData.applicant,
        //   status: candidateStatuses.PENDING_SELECTION,
        //   job: selectedCandidateData.job,
        //   [mutableNewApplicationStateNames.hr_remarks]: remarks,
        //   others: {
        //     ...selectedCandidateData.others,
        //     [mutableNewApplicationStateNames.others_scheduled_interview_date]:
        //       interviewDate,
        //   },
        // });

        toast.success(
          `Successfully sent mail to ${
            selectedCandidateData.others[
              mutableNewApplicationStateNames.others_applicant_email
            ]
          }`
        );

        updateCandidateData((prevCandidates) => {
          return [...prevCandidates, selectedCandidateData];
        });
        updateAppliedData((prevAppliedCandidates) => {
          return prevAppliedCandidates.filter(
            (application) => application.id !== selectedCandidateData.id
          );
        });

        return navigate("/home");

      default:
        console.log("no action");
        break;
    }
  };

  return (
    <>
      <div className="selected-candidate-screen-container">
        <ApplicantDetails
          hideIntro={true}
          hrPageActive={hrPageActive}
          applicantData={selectedCandidateData}
          showApplicationDetails={showApplicationDetails}
          handleViewApplicationBtnClick={() =>
            handleViewApplicationBtnClick
              ? handleViewApplicationBtnClick()
              : () => {}
          }
        />

        {!hrPageActive && (
          <AssignedProjectDetails
            assignedProject={selectedCandidateData.project && Array.isArray(selectedCandidateData.project) ? selectedCandidateData.project[0] : ""}
            removeDropDownIcon={true}
          />
        )}

        {initialMeet && hrPageActive && (
          <AssignedProjectDetails
            assignedProject={assignedProject}
            availableProjects={availableProjects}
            handleSelectionClick={(selection) => setAssignedProject(selection)}
          />
        )}

        {hireTabActive ? (
          <>
            <div className="comments-container hire-comment">
              <h2>
                Remarks <span>&#x00028;by Hr&#x00029;</span>
              </h2>
              <textarea
                placeholder={"Write here"}
                value={
                  selectedCandidateData[
                    mutableNewApplicationStateNames.hr_remarks
                  ]
                }
                readOnly={true}
              ></textarea>
            </div>
          </>
        ) : (
          <></>
        )}

        {showOnboarding ? (
          <></>
        ) : hrPageActive ? (
          <>
            {guestApplication ? (
              <></>
            ) : (
              <div className="comments-container hr__Comments__Container">
                <h2>
                  {initialMeet ? (
                    <>Remarks {<span>&#x00028;by Hr&#x00029;</span>}</>
                  ) : (
                    <>Add Remarks:</>
                  )}
                </h2>
                <textarea
                  placeholder={`${
                    initialMeet
                      ? `${selectedCandidateData.hr_remarks}`
                      : "Write here"
                  }`}
                  readOnly={initialMeet ? true : false}
                  value={
                    initialMeet
                      ? selectedCandidateData[
                          mutableNewApplicationStateNames.hr_remarks
                        ]
                      : remarks
                  }
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>
            )}
          </>
        ) : (
          <>
            {teamleadPageActive && (
              <div className="comments-container">
                <h2>Remarks by Hr</h2>
                <textarea
                  placeholder="Remarks by Hr"
                  value={
                    selectedCandidateData[
                      mutableNewApplicationStateNames.hr_remarks
                    ]
                  }
                  readOnly={true}
                ></textarea>
              </div>
            )}

            <div className="comments-container">
              <h2>
                {hireTabActive ? "" : "Add"} Remarks{" "}
                {hireTabActive ? (
                  <span>&#x00028;by Team Lead&#x00029;</span>
                ) : (
                  <></>
                )}
              </h2>
              <textarea
                placeholder={accountPage ? "Reason to Rehire" : "Write here"}
                value={
                  hireTabActive
                    ? selectedCandidateData.team_lead_remarks
                    : remarks
                }
                readOnly={hireTabActive ? true : false}
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>
            </div>
          </>
        )}

        {initialMeet && (
          <>
            <div className="comments-container hr__Comments__Container">
              <h2>Discord Link</h2>
              <input
                className=" white__Bg__Color"
                placeholder="Add Discord Link"
                value={hrDiscordLink}
                onChange={(e) => setHrDiscordLink(e.target.value)}
              ></input>
            </div>
          </>
        )}

        {guestApplication && (
          <>
            <div className="comments-container hr__Comments__Container">
              <h2>Interview Date</h2>
              <input
                className="interview__Input white__Bg__Color"
                placeholder="Add date for interview"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                type={"datetime-local"}
              ></input>
            </div>
          </>
        )}

        {hireTabActive ? (
          <PaymentDetails
            candidatePlatform={changeToTitleCase(
              selectedCandidateData[
                mutableNewApplicationStateNames.freelancePlatform
              ]
            )}
            handlePlatformSelectionClick={(selection) =>
              setCandidatePlatform(selection)
            }
          />
        ) : (
          <></>
        )}

        <div
          className={`candidate-status-container ${
            showOnboarding ? "onboarding-active" : ""
          }`}
        >
          {/* <h2>Status {accountPage && rehireTabActive ? <span>&#x00028;by Team Lead&#x00029;</span> : ''}</h2> */}
          <div
            className={`status-options-container ${
              rehireTabActive ? "rehire" : ""
            }`}
          >
            {rehireTabActive ? (
              <button
                className={`status-option green-color ${
                  accountPage
                    ? selectedCandidateData.status ===
                      candidateStatuses.TEAMLEAD_TOREHIRE
                      ? "active"
                      : ""
                    : ""
                }`}
                ref={ref3}
                onClick={() => handleClick(ref3, false)}
                disabled={accountPage ? true : disabled}
              >
                {/* <CheckCircleIcon className="status-icon" /> */}
                <br />
                <br />
                <div className="textt">Pay</div>
              </button>
            ) : (
              <></>
            )}

            {hrPageActive ? (
              <>
                <button
                  className={`status-option green-bg ${
                    initialMeet ? "green-color" : "orange-color"
                  } ${
                    initialMeet
                      ? ""
                      : selectedCandidateData.status ===
                        candidateStatuses.SHORTLISTED
                      ? "active"
                      : ""
                  }`}
                  ref={ref7}
                  onClick={() =>
                    handleClick(
                      ref7,
                      true,
                      initialMeet
                        ? hrPageActions.MOVE_TO_SELECTED
                        : guestApplication
                        ? hrPageActions.MOVE_TO_PENDING
                        : hrPageActions.MOVE_TO_SHORTLISTED
                    )
                  }
                  disabled={
                    initialMeet
                      ? disabled
                      : selectedCandidateData.status ===
                        candidateStatuses.SHORTLISTED
                      ? true
                      : disabled
                  }
                >
                  {/* <BsStopCircle className='status-icon' /> */}
                  {/* <br /><br/> */}
                  <div className="textt">{`${
                    initialMeet
                      ? "Selected"
                      : guestApplication
                      ? "Pending"
                      : "Shortlisted"
                  }`}</div>
                </button>
              </>
            ) : (
              <button
                className={`status-option green-bg ${
                  rehireTabActive ? "green-color" : "orange-color"
                } ${
                  accountPage && rehireTabActive
                    ? selectedCandidateData.status ===
                      candidateStatuses.TEAMLEAD_TOREHIRE
                      ? "active"
                      : "none"
                    : ""
                }`}
                ref={ref1}
                onClick={() =>
                  handleClick(
                    ref1,
                    true,
                    hireTabActive
                      ? accountPageActions.MOVE_TO_ONBOARDING
                      : showOnboarding
                      ? teamleadPageActive
                        ? teamLeadActions.MOVE_TO_REHIRE
                        : accountPageActions.MOVE_TO_REHIRE
                      : rehireTabActive
                      ? teamLeadActions.MOVE_TO_REHIRE
                      : teamLeadActions.MOVE_TO_HIRED
                  )
                }
                disabled={accountPage && rehireTabActive ? true : disabled}
              >
                {/* <BsStopCircle className='status-icon' /> */}
                {/* <br /><br/> */}
                <div className="textt">
                  {`${
                    rehireTabActive
                      ? "ReHire"
                      : hireTabActive
                      ? "Onboarding"
                      : showOnboarding
                      ? "ReHire"
                      : "Hire"
                  }`}
                </div>
              </button>
            )}

            {showOnboarding ? (
              <></>
            ) : hrPageActive ? (
              <>
                <button
                  className="status-option red-color"
                  ref={ref6}
                  onClick={() =>
                    handleClick(ref6, true, hrPageActions.MOVE_TO_REJECTED)
                  }
                  disabled={disabled}
                >
                  {/* <BsStopCircle className='status-icon' />
                                <br /><br/>
                                 */}
                  <div className="textt">{"Rejected"}</div>
                </button>
              </>
            ) : (
              <button
                className="status-option red-color"
                ref={ref2}
                onClick={() =>
                  handleClick(ref2, true, accountPageActions.MOVE_TO_REJECTED)
                }
                disabled={disabled}
              >
                {accountPage && rehireTabActive ? (
                  <></>
                ) : (
                  // <AiOutlineCloseCircle className="status-icon" />
                  <></>
                  // <BsStopCircle className="status-icon" />
                )}
                {/* <br /> */}
                {/* <br /> */}

                <div className="textt">
                  {hireTabActive ? "Reject" : "Rejected"}
                </div>
              </button>
            )}
          </div>

          {accountPage && rehireTabActive ? (
            <>
              {/* <CustomHr className="rehire-hr" /> */}
              <h2 className="top-m">Status</h2>
              <div className="status-options-container">
                <button
                  className="status-option green-color"
                  ref={ref4}
                  onClick={() =>
                    handleClick(
                      ref4,
                      true,
                      accountPageActions.MOVE_TO_ONBOARDING
                    )
                  }
                  disabled={disabled}
                >
                  {/* <BsStopCircle className="status-icon" /> */}
                  <br />
                  <br />
                  <div className="textt">Onboarding</div>
                </button>
                <button
                  className="status-option red-color"
                  ref={ref5}
                  onClick={() =>
                    handleClick(ref5, true, accountPageActions.MOVE_TO_REJECTED)
                  }
                  disabled={disabled}
                >
                  {/* <BsStopCircle className="status-icon" /> */}
                  <br />
                  <br />
                  <div className="textt">Reject</div>
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectedCandidatesScreen;
