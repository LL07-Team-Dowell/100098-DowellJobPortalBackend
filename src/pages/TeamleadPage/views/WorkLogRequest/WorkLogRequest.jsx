import React, { useEffect, useReducer } from "react";
import "./style.scss";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useGetAllUpdateTask } from "../../../CandidatePage/views/WorkLogRequest/hook/useGetAllUpdateTask";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";
import {
  approveLogRequest,
  denyLogRequest,
  getAllUpdateTask,
} from "../../../../services/taskUpdateServices";
import { toast } from "react-toastify";
import LittleLoading from "../../../CandidatePage/views/ResearchAssociatePage/littleLoading";

const WorkLogRequest = ({ cardData }) => {
  const { currentUser } = useCurrentUserContext();
  const [loading, setLoading] = useState(false);
  const [approveRequestLoading, setApproveRequestLoading] = useState([]);
  const [reasonForDenial, setReasonForDenial] = useState("");
  const [denyRequestLoading, setDenyRequestLoading] = useState([]);
  const [data, setData] = useState([]);
  const [approve, setApprove] = useState([]);
  const [deny, setDeny] = useState([]);
  const [pendingApproval, setPendingApproval] = useState([]);
  const { error } = useGetAllUpdateTask(currentUser);
  const [reducerReuest, forceUpdate] = useReducer((x) => x + 1, 0);
  const [reducerRequest, forceUpdateRequest] = useReducer((x) => x + 1, 0);
  const [showDenyPopup, setShowDenyPopup] = useState(false);
  const [ projectsForLead, setProjectsForLead ] = useState([]);
  const [ currentProjectSelected, setCurrentProjectSelected ] = useState('');
  // asdsad

  const unshowDenyPopup = () => {
    setShowDenyPopup(false);
  };

  const showDenyPopupFunction = (element) => {
    setShowDenyPopup(true);
  };

  useEffect(() => {
    setLoading(true);

    getAllUpdateTask(currentUser.portfolio_info[0].org_id)
      .then((response) => {
        console.log(response.data.response.data);
        const request = response?.data?.response?.data?.reverse();
        
        const userMainProject = currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.project;
        const userHasOtherProjects = currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects &&
          Array.isArray(
            currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects
          );
        
        const projects = userHasOtherProjects ? 
          [userMainProject, ...currentUser.settings_for_profile_info.profile_info[currentUser.settings_for_profile_info.profile_info.length - 1]?.additional_projects]
        :
        [userMainProject];

        setProjectsForLead(projects);
          
        const sortedRequest = request.filter(
          (applicant) =>
            applicant?.company_id === currentUser.portfolio_info[0].org_id
        ).filter(applicant => 
          projects.includes(applicant.project)  
        );
        setData(sortedRequest);

        const approveRequest = sortedRequest?.filter(
          (element) =>
            element.approved === true && element.request_denied === false
        );

        const denyRequest = sortedRequest?.filter(
          (element) =>
            element.approved === false && element.request_denied === true
        );

        const pendingApprovalRequest = sortedRequest?.filter(
          (element) =>
            element.approved === false && element.request_denied === false
        );

        setApprove(approveRequest);
        setDeny(denyRequest);
        setPendingApproval(pendingApprovalRequest);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, [reducerReuest, reducerRequest]);

  const approveRequest = (element) => {
    setApproveRequestLoading([...approveRequestLoading, element._id]);
    approveLogRequest(element._id, {
      approved_by: currentUser.userinfo.username,
    })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setApproveRequestLoading(
            approveRequestLoading.filter((id) => id !== element._id)
          );

          setApprove((prev) => {
            return [...prev, { ...element, approved: true }]
          });

          setPendingApproval((prev) => {
            return prev.filter(elem => elem._id !== element._id)
          })

          toast.success("Successfully approved request");
          forceUpdateRequest();
        }
      })
      .catch((error) => {
        console.log(error);
        setApproveRequestLoading(
          approveRequestLoading.filter((id) => id !== element._id)
        );
        toast.error('An error occured while trying to approve this request. Please try again')
      });
  };

  const denyRequest = (element) => {
    if (reasonForDenial.length < 1) return toast.info('Please enter a reason');

    setDenyRequestLoading([...denyRequestLoading, element._id]);
    denyLogRequest(element._id, {
      reason_for_denial: reasonForDenial,
      denied_by: currentUser.userinfo.username,
    })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setDenyRequestLoading(
            denyRequestLoading.filter((id) => id !== element._id)
          );

          setDeny((prev) => {
            return [...prev, { ...element, request_denied: true, reason_for_denial: reasonForDenial, }]
          });

          setPendingApproval((prev) => {
            return prev.filter(elem => elem._id !== element._id)
          })

          toast.success("Successfully denied request");
          setShowDenyPopup(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setDenyRequestLoading(
          denyRequestLoading.filter((id) => id !== element._id)
        );
        toast.error('An error occured while trying to deny this request. Please try again')
      });
  };

  if (error) return <h1>{error}</h1>;

  if (loading) return <LoadingSpinner />;
  return (
    <div className="work__log__request__teams">
      <div className="project__Select__Wrapper project__teams">
        <select
          defaultValue={""}
          value={currentProjectSelected}
          onChange={({ target }) => setCurrentProjectSelected(target.value)}
        >
          <option value={""} disabled>
            Select project
          </option>
          {React.Children.toArray(
            projectsForLead.map((project) => {
              return <option value={project}>{project}</option>;
            })
          )}
        </select>
      </div>
      <div className="cards__teams">
        {cardData === "Pending approval" && (
          <>
            {React.Children.toArray(
              pendingApproval.filter(element => element.project === currentProjectSelected).map((element) => (
                <div className="card__work__log__request__teams" key={element._id}>
                  <h2>{typeof element.username === 'string' && element.username}</h2>
                  <p>
                    Date of request:{" "}
                    {new Date(element.update_task_date) == "Invalid Date"
                      ? element.update_task_date
                      : new Date(element.update_task_date).toDateString()}
                  </p>
                  <p>Request reason: {typeof element.update_reason === 'string' &&  element.update_reason}</p>
                  <p>Project: {typeof element.project === 'string' && element.project}</p>
                  <div className="request__action__btn">
                    <button
                      className="req__act__btn "
                      onClick={() => approveRequest(element)}
                      disabled={approveRequestLoading.includes(element._id) ? true : false}
                    >
                      {
                        approveRequestLoading.includes(element._id) ?
                          <LoadingSpinner width={'0.9rem'} height={'0.9rem'} color={'#fff'} />
                        :
                        'Approve'
                      }
                    </button>
                    {showDenyPopup && (
                      <div className="overlay log_req">
                        <div className="delete_confirmation_container delete__logRequest__teams">
                          <h2>Enter Reason For Denying</h2>
                          <span className="extra__Detail">User: {typeof element.username === 'string' && element.username}</span>
                          <span className="extra__Detail">Request reason: {typeof element.update_reason === 'string' &&  element.update_reason}</span>
                          <label htmlFor="reasonDeny">
                            <span>Reason for denial</span>
                            <textarea
                              type="text"
                              placeholder="Reason for denial"
                              onChange={(e) =>
                                setReasonForDenial(e.target.value)
                              }
                              rows={4}
                            ></textarea>
                          </label>
                          <br />
                          <div className="buttons">
                            <button
                              onClick={() => denyRequest(element)}
                              className="delete"
                              disabled={denyRequestLoading.includes(element._id) ? true : false}
                            >
                              {
                                denyRequestLoading.includes(element._id) ?
                                  <LoadingSpinner width={'0.9rem'} height={'0.9rem'} color={'#fff'} />
                                :
                                  'Deny'
                              }
                            </button>
                            <button onClick={unshowDenyPopup}>Cancel</button>
                          </div>
                        </div>
                      </div>
                    )}
                    <button
                      className="req__act__btn deny"
                      onClick={showDenyPopupFunction}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {cardData === "Approved" && (
          <>
            {React.Children.toArray(
              approve.filter(element => element.project === currentProjectSelected).map((element) => (
                <div className="card__work__log__request__teams" key={element._id}>
                  <h2>{typeof element.username === 'string' && element.username}</h2>
                  <p>
                    Date of request:{" "}
                    {new Date(element.update_task_date) == "Invalid Date"
                      ? element.update_task_date
                      : new Date(element.update_task_date).toDateString()}
                  </p>
                  <p>Request reason: {typeof element.update_reason === 'string' &&  element.update_reason}</p>
                  <p>Project: {typeof element.project === 'string' && element.project}</p>
                </div>
              ))
            )}
          </>
        )}

        {cardData === "Denied" && (
          <>
            {React.Children.toArray(
              deny.filter(element => element.project === currentProjectSelected).map((element) => (
                <div className="card__work__log__request__teams" key={element._id}>
                  <h2>{ typeof element.username === 'string' && element.username}</h2>
                  <p>
                    Date of request:{" "}
                    {new Date(element.update_task_date) == "Invalid Date"
                      ? element.update_task_date
                      : new Date(element.update_task_date).toDateString()}
                  </p>
                  <p>Request reason: { typeof element.update_reason === 'string' &&  element.update_reason}</p>
                  <p>Project: { typeof element.project === 'string' && element.project}</p>
                  <p>Reason for denial: {typeof element.reason_for_denial === 'string' && element.reason_for_denial}</p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WorkLogRequest;
