import Avatar from "react-avatar";
import styles from "./styles.module.css";
import { HiOutlineDotsVertical } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { useHrJobScreenAllTasksContext } from "../../../../contexts/HrJobScreenAllTasks";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { getSettingUserProject } from "../../../../services/hrServices";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import { adminDeleteApplication, adminLeaveApplication, updateCandidateApplicationDetail } from "../../../../services/adminServices";
import { changeToTitleCase } from "../../../../helpers/helpers";
import { JOB_APPLICATION_CATEGORIES } from "../../../CandidatePage/utils/jobCategories";
import Overlay from "../../../../components/Overlay";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";

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
  } = useHrJobScreenAllTasksContext();
  const { currentUser } = useCurrentUserContext();
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [leaveOverlayVisibility, setLeaveOverlayVisibility] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!projectsLoaded) {
      setProjectsLoading(true);

      getSettingUserProject()
        .then((res) => {
          const projectsGotten = res?.data
            ?.filter(
              (project) =>
                project?.data_type ===
                currentUser?.portfolio_info[0]?.data_type &&
                project?.company_id ===
                currentUser?.portfolio_info[0]?.org_id &&
                project.project_list &&
                project.project_list.every(
                  (listing) => typeof listing === "string"
                )
            )
            ?.reverse();

          if (projectsGotten.length > 0) {
            setProjectsAdded(projectsGotten);
          }

          setProjectsLoading(false);
          setProjectsLoaded(true);
        })
        .catch((err) => {
          console.log("Failed to get projects for admin");
          setProjectsLoading(false);
        });
    }
  }, []);

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
    setLeaveOverlayVisibility(false);
  };
  const handleSubmitClick = async () => {
    const start_Date = new Date(startDate);
    const end_Date = new Date(endDate);

    if (!startDate || !endDate) {
      return toast.info('Please enter both start and end dates');
    }

    if (start_Date >= end_Date) {
      setStartDate('');
      setEndDate('');
      return toast.info('Start date should be less than end date');
    }

    const dataToPost = {
      applicant_id: application._id,
      leave_start: startDate,
      leave_end: endDate,
    };

    try{
      const res = await (await adminLeaveApplication('approved_leave',dataToPost)).data;
      console.log("set leave application responseeeeeeeeeeeeeeeeeeeee: ", res);
    }catch(error){
      console.log("err setting leave");
    }
  }

  return (
    <>
      <div className={`${styles.full__Application__Item}`}>
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
            <p>Project: {application.project[0]}</p>
          )}
        </div>
        {showEditOptions && (
          <ul className={styles.update__Listing}>
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
        {leaveOverlayVisibility && (
          <Overlay>
            <div className={styles.edit__Modal}>
              <AiOutlineClose
                onClick={handleClosingLeaveItemClick}
                className={styles.edit__Icon}
              />
              <h2>Set Leave</h2>
              <label>
                <span>Start Date:</span>
                <input type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label>
                <span>End Date:</span>
                <input type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
              <button className={styles.edit__Btn} onClick={handleSubmitClick}>Submit</button>
            </div>
          </Overlay>
        )}
        {showEditModal && (
          <Overlay>
            <div className={styles.edit__Modal}>
              <AiOutlineClose
                onClick={handleCloseModal}
                className={styles.edit__Icon}
              />
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
