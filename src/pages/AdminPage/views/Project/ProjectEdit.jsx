import { useState } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./styles.module.css";
import { MdArrowBackIosNew } from "react-icons/md";
import { useEffect } from "react";
import { getProjectTime } from "../../../../services/projectTimeServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";

const ProjectEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useCurrentUserContext();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const project = urlParams.get("project");
  const id = urlParams.get("id");
  //  console.log(id)
  // console.log(project);

  const [projectTimeDetail, setProjectTimeDetail] = useState({
    total_time: 0,
    lead_name: "",
    editing_enabled: true,
    spent_time: 0,
    left_time: 0,
  });

  const handleInputChange = (valueEntered, inputName) => {
    setProjectTimeDetail((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = valueEntered;
      return copyOfPrevValue;
    });
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (id) {
          setLoading(true);

          const projectDetails = await getProjectTime(
            currentUser.portfolio_info[0].org_id
          );

          const editProjectData = projectDetails?.data?.data;
          // console.log(projectDetails?.data?.data)

          // Find the object with the specific id
          const editDetails = editProjectData.find(
            (item) => item["_id"] === id
          );

          if (editDetails) {
            setProjectTimeDetail((prevDetails) => {
              return { ...prevDetails, ...editDetails };
            });
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      hideTitleBar={false}
      pageTitle={"Projects"}
      handleNavIcon={() => navigate(-1)}
      newSidebarDesign={true}
    >
      <div className={styles.wrapper}>
        <div className={styles.edit__Nav__Content}>
          <button
            onClick={() => navigate(-1)}
            style={{
              borderRadius: "0.8rem",
              padding: "0 0.7rem",
              border: "none",
              backgroundColor: "#fff",
              boxShadow: "inset 0px 1.7px 8px rgba(0, 0, 0, 0.16)",
            }}
          >
            <MdArrowBackIosNew
              style={{
                color: "#005734",
                fontSize: 25,
                cursor: "pointer",
              }}
            />
          </button>
          <h2>Edit Project</h2>
        </div>
        <div className={styles.project__details__bg}>
          <button className={styles.project__name__heading}>
            <h2>{project}</h2>
          </button>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div
                style={{
                  maxWidth: 300,
                  margin: "0 auto",
                  padding: "2rem 1rem",
                }}
              >
                <CircularProgressbar
                  value={Number(
                    (projectTimeDetail.spent_time /
                      projectTimeDetail.total_time) *
                      100
                  ).toFixed(2)}
                  text={`${Number(
                    (projectTimeDetail.spent_time /
                      projectTimeDetail.total_time) *
                      100
                  ).toFixed(2)}%`}
                  styles={buildStyles({
                    pathColor: `#005734`,
                    textColor: "#005734",
                    trailColor: "#efefef",
                    backgroundColor: "#005734",
                  })}
                />
              </div>
              <div>
                <div className={styles.editing__project}>
                  <label htmlFor="editing_enabled"></label>
                  <div className={styles.is__active}>
                    <input
                      className={styles.active__checkbox}
                      type="checkbox"
                      name={"editing_enabled"}
                      checked={projectTimeDetail.editing_enabled}
                      onChange={(e) =>
                        handleInputChange(e.target.checked, e.target.name)
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                {projectTimeDetail.editing_enabled ? (
                  <>
                    <div className={styles.job__details}>
                      <label htmlFor="lead_name">Lead Name</label>
                      <input
                        type="text"
                        id="lead_name"
                        name="lead_name"
                        placeholder="Enter lead name"
                        value={projectTimeDetail.lead_name}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className={styles.job__details}>
                      <label htmlFor="total_time">Total Time</label>
                      <input
                        type="text"
                        id="total_time"
                        name="total_time"
                        placeholder="Enter total time"
                        value={projectTimeDetail.total_time}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.job__details}>
                      <label htmlFor="lead_name">Lead Name</label>
                      <input
                        type="text"
                        id="lead_name"
                        name="lead_name"
                        placeholder="Enter lead name"
                        value={projectTimeDetail.lead_name}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                        disabled
                      />
                    </div>
                    <div className={styles.job__details}>
                      <label htmlFor="total_time">Total Time</label>
                      <input
                        type="text"
                        id="total_time"
                        name="total_time"
                        placeholder="Enter total time"
                        value={projectTimeDetail.total_time}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                        disabled
                      />
                    </div>
                  </>
                )}
              </div>
              <div className={styles.project__btn}>
                <button className={styles.project__submit}>Update</button>
              </div>
            </>
          )}
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};

export default ProjectEdit;
