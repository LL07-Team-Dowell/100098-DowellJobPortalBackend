import Avatar from "react-avatar";
import styles from "./styles.module.css";
import { HiOutlineDotsVertical } from "react-icons/hi";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Overlay from "../../../../../../components/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import { useJobContext } from "../../../../../../contexts/Jobs";
import LoadingSpinner from "../../../../../../components/LoadingSpinner/LoadingSpinner";
import { candidateStatuses } from "../../../../../CandidatePage/utils/candidateStatuses";
import { changeToTitleCase } from "../../../../../../helpers/helpers";
import { JOB_APPLICATION_CATEGORIES } from "../../../../../CandidatePage/utils/jobCategories";
import Select from "react-select";
import { getSettingUserProject } from "../../../../../../services/hrServices";
import { useCurrentUserContext } from "../../../../../../contexts/CurrentUserContext";
import {
  adminDeleteApplication,
  adminLeaveApplication,
  updateCandidateApplicationDetail,
  adminLeaveApply
} from "../../../../../../services/adminServices";
import { Link } from "react-router-dom";
import useClickOutside from "../../../../../../hooks/useClickOutside";
import { getDaysDifferenceBetweenDates } from "../../../../../../helpers/helpers";

export default function FullApplicationCardItem({ application, activeStatus }) {
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemBeignEdited, setItemBeingEdited] = useState(null);
  const {
    applications,
    setApplications,
    setProjectsLoading,
    projectsAdded,
    setProjectsAdded,
    setProjectsLoaded,
    projectsLoaded,
  } = useJobContext();
  const { currentUser } = useCurrentUserContext();
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [leaveOverlayVisibility, setLeaveOverlayVisibility] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noOfWeeks, setNoOfWeeks] = useState('');
  const [viewOverlayVisibility, setViewOverlayVisibility] = useState(false);
  const updateListingRef = useRef();
  const [isLeaveLoading, setIsLeaveLoading] = useState(false);

  useClickOutside(updateListingRef, () => setShowEditOptions(false));

  const handleViewItemClick = () => {
    setViewOverlayVisibility(true);
  };

  const handleClosingviewItemClick = () => {
    setViewOverlayVisibility(false);
  };

  useEffect(() => {
    setItemBeingEdited(application);
  }, [application]);

  const handleUpdateItemClick = () => {
    setShowEditOptions(false);
    setShowEditModal(true);
  };

  const handleUpdateApplicationDetail = (name, val) => {
    setItemBeingEdited((prevDetail) => {
      return {
        ...prevDetail,
        [name]: val,
      };
    });
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setItemBeingEdited(application);
  };

  const handleUpdateApplication = async () => {
    if (
      itemBeignEdited?.status === candidateStatuses.ONBOARDING &&
      (!itemBeignEdited?.project ||
        !Array.isArray(itemBeignEdited?.project) ||
        (Array.isArray(itemBeignEdited?.project) &&
          itemBeignEdited?.length < 1))
    )
      return toast.info("Please select a project for user");

    console.log(itemBeignEdited);
    setEditLoading(true);

    if (itemBeignEdited?.status !== application.status) {
      try {
        const updatedStatRes = (
          await updateCandidateApplicationDetail(
            "update_status",
            application._id,
            {
              status: itemBeignEdited?.status,
            }
          )
        ).data;
        console.log(updatedStatRes);
      } catch (error) {
        console.log("Err updating status");
      }
    }

    if (itemBeignEdited?.job_category !== application.job_category) {
      try {
        const updatedCategoryRes = (
          await updateCandidateApplicationDetail(
            "update_job_category",
            application._id,
            {
              job_category: itemBeignEdited?.job_category,
            }
          )
        ).data;
        console.log(updatedCategoryRes);
      } catch (error) {
        console.log("Err updating category");
      }
    }

    if (
      (itemBeignEdited?.project && Array.isArray(itemBeignEdited?.project) && application.project && Array.isArray(application.project)) &&
      (
        (itemBeignEdited?.project?.length !== application.project.length) ||
        (!itemBeignEdited?.project?.every(item => application.project.includes(item))) ||
        (!application?.project?.every(item => itemBeignEdited?.project?.includes(item)))
      )
    ) {
      try {
        const updatedProjectRes = (
          await updateCandidateApplicationDetail(
            "update_project",
            application._id,
            {
              project: itemBeignEdited?.project,
              company_id: itemBeignEdited?.company_id,
            }
          )
        ).data;
        console.log(updatedProjectRes);
      } catch (error) {
        console.log("Err updating project");
      }
    }

    const currentApplications = applications?.slice();
    const foundApplicationBeingEditedIndex = currentApplications.findIndex(
      (app) => app._id === application._id
    );
    if (foundApplicationBeingEditedIndex !== -1) {
      currentApplications[foundApplicationBeingEditedIndex] = itemBeignEdited;
      setApplications(currentApplications);
    }

    setEditLoading(false);
    setShowEditModal(false);

    toast.success(
      `Successfully edited application of ${application?.applicant}`
    );
  };

  const handleDeleteApplication = async () => {
    if (deleteLoading) return;

    const currentApplications = applications?.slice();
    setDeleteLoading(true);

    const dataToPost = {
      application_id: application._id,
    };

    try {
      const res = await (await adminDeleteApplication(dataToPost)).data;
      console.log("delete application response: ", res);

      setApplications(
        currentApplications.filter((app) => app._id !== application._id)
      );
      toast.success(
        `Successfully deleted application of ${application?.applicant}`
      );
      setDeleteLoading(false);

      setShowEditOptions(false);
    } catch (error) {
      console.log("err deleting");
      setDeleteLoading(false);
      toast.error(
        `An error occured while trying to delete application of ${application?.applicant}`
      );
    }
  };

  const handleLeaveItemClick = () => {
    setLeaveOverlayVisibility(true);
  };
  const handleClosingLeaveItemClick = () => {
    setStartDate('');
    setEndDate('');
    setNoOfWeeks('');
    setLeaveOverlayVisibility(false);
  };

  const handleSubmitClick = async () => {
    setIsLeaveLoading(true);
    const start_Date = new Date(startDate);
    const end_Date = new Date(endDate);

    if (!startDate || !endDate) {
      return toast.info('Please enter both start and end dates');
    }

    // console.log('days difference', getDaysDifferenceBetweenDates(startDate, endDate));
    if (getDaysDifferenceBetweenDates(startDate, endDate) < 7 - 1) {
      setStartDate('');
      setEndDate('');
      return toast.info('Difference between start and end date should be greater than or equal to 7 days!');
    }

    // const dataToPost = {
    //   applicant_id: application._id,
    //   leave_start: startDate,
    //   leave_end: endDate,
    // };
    const dataToPost = {
      "user_id": application?.user_id,
      "applicant": application?.applicant,
      "company_id": application?.company_id,
      "project": application?.project,
      "leave_start_date": startDate,
      "leave_end_date": endDate,
      "email": application?.applicant_email,
      "data_type": currentUser?.portfolio_info[0]?.data_type,
    }

    try {
      await (await adminLeaveApply(dataToPost)).data;
      toast.success('Leave assigned successfully.')
      setIsLeaveLoading(false);
    } catch (error) {
      toast.error('Unable to set leave. Please try again.')
      setIsLeaveLoading(false);
    }
  }

  const handleWeekChange = (e) => {
    const inputValue = e.target.value;
    const numericRegex = /^[0-9]*$/;

    if (!numericRegex.test(inputValue)) {
      return toast.error('Please enter only numbers and number greater than 0 for weeks!');
    }
    if (!startDate) {
      return toast.error('Please select start date first!');
    }
    const selectedStartDate = new Date(startDate);
    const numberOfWeeks = parseInt(inputValue);
    if (numberOfWeeks < 0) {
      setEndDate('');
      setNoOfWeeks('');
    } else {
      // if (numberOfWeeks >= 0) {
      const endDate = new Date(selectedStartDate.setDate(selectedStartDate.getDate() + (numberOfWeeks * 7)));
      endDate.setDate(endDate.getDate() - 1);
      setEndDate(endDate.toISOString().split('T')[0]);
      setNoOfWeeks(numberOfWeeks);
    }
  }

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setNoOfWeeks('');
    setEndDate('');
  }

  return (
    <>
      <div className={`${styles.full__Application__Item} ${styles.admin__Item}`}>
        <div
          className={styles.edit__App}
          onClick={() => setShowEditOptions(!showEditOptions)}
        >
          <HiOutlineDotsVertical />
        </div>
        <div>
          <Avatar
            name={
              application.applicant.slice(0, 1) +
              " " +
              application.applicant
                .split(" ")
              [application.applicant.split(" ").length - 1]?.slice(0, 1)
            }
            round={true}
            size='5rem'
          />
        </div>
        <div className={styles.detail}>
          <h2>{application.applicant}</h2>
          <p>{application.job_category}</p>
        </div>
        <div className={activeStatus ? styles.active : styles.inactive}>
          <p>{activeStatus ? "Active" : "Inactive"}</p>
        </div>
        <div className={styles.applicant__Details}>
          <p>Email: {application.applicant_email}</p>
          <p>Country: {application.country}</p>
          <p>
            Current Status:{" "}
            {changeToTitleCase(application?.status?.replace("_", " "))}
          </p>
          <p>Job: {application.job_title}</p>
          {application.project && Array.isArray(application.project) && (
            <p>Project: {`${application.project.join(', ')}`}</p>
          )}
        </div>
        {showEditOptions && (
          <ul className={styles.update__Listing} ref={updateListingRef}>
            <li className={styles.item} onClick={handleViewItemClick}>
              View
            </li>
            <li className={styles.item} onClick={handleUpdateItemClick}>
              Update
            </li>
            {application.status === candidateStatuses.ONBOARDING && (
              <li className={styles.item} onClick={handleLeaveItemClick}>
                Assign leave
              </li>
            )}
            <li className={styles.delete} onClick={handleDeleteApplication}>
              {deleteLoading ? "Deleting.." : "Delete"}
            </li>
          </ul>
        )}
        {viewOverlayVisibility && (
          <Overlay>
            <div className={styles.edit__Modal}>
              <div style={{ width: "100%" }}>
                <AiOutlineClose
                  onClick={handleClosingviewItemClick}
                  className={styles.edit__Icon}
                />
              </div>
              <h2>Application Details</h2>
              <div className={styles.view_modal_avatar}>
                <div>
                  <Avatar
                    name={
                      application.applicant.slice(0, 1) +
                      " " +
                      application.applicant
                        .split(" ")
                      [application.applicant.split(" ").length - 1]?.slice(
                        0,
                        1
                      )
                    }
                    round={true}
                    size="5rem"
                  />
                </div>
                <div className={styles.applicant_info}>
                  <h2>{application.applicant}</h2>
                  <p>{application.job_category}</p>
                </div>
              </div>
              <div className={activeStatus ? styles.active : styles.inactive}>
                <p>{activeStatus ? "Active" : "Inactive"}</p>
              </div>
              <div className={styles.applicant_oth_info}>
                <p>
                  <b>Username:</b> {application.username}
                </p>
                <p>
                  <b>Email:</b> {application.applicant_email}
                </p>
                <p>
                  <b>Country:</b> {application.country}
                </p>
                <p>
                  <b>Current Status:</b>{" "}
                  {changeToTitleCase(application?.status?.replace("_", " "))}
                </p>
                <p>
                  <b>Job:</b> {application.job_title}
                </p>
                <p>
                  <b>Pay:</b> {application?.payment}
                </p>
                <p>
                  <b>Application Submitted On:</b> {`${new Date(application.application_submitted_on).toDateString()}`}
                </p>
                {
                  application.hired_on ? <p>
                    <b>Hired On:</b> {`${new Date(application.hired_on).toDateString()}`}
                  </p> :
                    <></>
                }
                {
                  application.onboarded_on ? <p>
                    <b>Onboarded:</b> {`${new Date(application.onboarded_on).toDateString()}`}
                  </p> :
                    <></>
                }
                <p>
                  <b>Freelancing Platform:</b> {application.freelancePlatform}
                </p>
                <p>
                  <b>Freelancing Platform URL:</b>
                  <Link
                    to={application.freelancePlatformUrl}
                    target="_blank"
                  >Click Here!</Link>
                </p>
                <p>
                  <b>Job Applied For:</b> {application.job_title}
                </p>

                {
                  application.project && Array.isArray(application.project) && (
                    <p>
                      <b>Project:</b>
                      {application.project[0]}
                    </p>
                  )
                }
              </div>
            </div>
          </Overlay>
        )}
        {leaveOverlayVisibility && (
          <Overlay>
            <div className={styles.edit__Modal}>
              <div style={{ width: '100%' }}>
                <AiOutlineClose
                  onClick={handleClosingLeaveItemClick}
                  className={styles.edit__Icon}
                />
              </div>
              <h2>Set Leave</h2>
              <label>
                <span>Start Date:</span>
                <input type='date'
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e)}
                />
              </label>
              <label>
                <span>Number of week(s):</span>
                <input type='number'
                  value={noOfWeeks}
                  onChange={(e) =>
                    handleWeekChange(e)
                  }
                />
              </label>
              <label>
                <span>End Date:</span>
                <input type='date'
                  value={endDate}
                  // onChange={(e) => setEndDate(e.target.value)}
                  disabled
                />
              </label>
              <button className={styles.edit__Btn} onClick={handleSubmitClick}>
                {isLeaveLoading ? <LoadingSpinner width={18} height={18} /> :
                  'Submit'
                }</button>
            </div>
          </Overlay>
        )}
        {showEditModal && (
          <Overlay>
            <div className={styles.edit__Modal}>
              <div style={{ width: '100%' }}>
                <AiOutlineClose
                  onClick={handleCloseModal}
                  className={styles.edit__Icon}
                />
              </div>
              <h2>Edit Application for {itemBeignEdited?.applicant}</h2>

              <label>
                <span>Edit Application Status</span>
                <select
                  className={styles.select__Item}
                  value={itemBeignEdited?.status}
                  onChange={({ target }) =>
                    handleUpdateApplicationDetail("status", target.value)
                  }
                >
                  {React.Children.toArray(
                    Object.keys(candidateStatuses || {}).map((key) => {
                      return (
                        <option
                          value={candidateStatuses[key]}
                          selected={
                            itemBeignEdited?.status === candidateStatuses[key]
                          }
                        >
                          {changeToTitleCase(
                            candidateStatuses[key].replace("_", " ")
                          )}
                        </option>
                      );
                    })
                  )}
                </select>
              </label>
              <label>
                <span>Edit application category</span>
                <select
                  className={styles.select__Item}
                  value={itemBeignEdited?.job_category}
                  onChange={({ target }) =>
                    handleUpdateApplicationDetail("job_category", target.value)
                  }
                >
                  {React.Children.toArray(
                    JOB_APPLICATION_CATEGORIES.map((category) => {
                      return (
                        <option
                          value={category}
                          selected={category === itemBeignEdited?.job_category}
                        >
                          {category}
                        </option>
                      );
                    })
                  )}
                </select>
              </label>
              {itemBeignEdited?.status === candidateStatuses.ONBOARDING && (
                <label>
                  <span>Edit project</span>
                  <Select
                    value={
                      itemBeignEdited?.project &&
                        Array.isArray(itemBeignEdited?.project)
                        ? itemBeignEdited?.project?.map((item) => {
                          return { label: item, value: item };
                        })
                        : []
                    }
                    options={
                      projectsLoaded &&
                        projectsAdded[0] &&
                        projectsAdded[0]?.project_list
                        ? [
                          ...projectsAdded[0]?.project_list
                            ?.sort((a, b) => a.localeCompare(b))
                            ?.map((project) => {
                              return { label: project, value: project };
                            }),
                        ]
                        : []
                    }
                    isMulti={true}
                    onChange={(val) =>
                      handleUpdateApplicationDetail(
                        "project",
                        val.map((item) => item.value)
                      )
                    }
                    className={styles.select__project}
                  />
                </label>
              )}
              <br />
              <button
                className={styles.edit__Btn}
                disabled={editLoading ? true : false}
                onClick={handleUpdateApplication}
              >
                <span>
                  {editLoading ? (
                    <LoadingSpinner
                      color={"#fff"}
                      width={"1.3rem"}
                      height={"1.3rem"}
                    />
                  ) : (
                    "Update"
                  )}
                </span>
              </button>
            </div>
          </Overlay>
        )}
      </div>
    </>
  );
}
