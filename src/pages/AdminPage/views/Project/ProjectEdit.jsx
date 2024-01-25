import { useState } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { MdArrowBackIosNew } from "react-icons/md";
import { useEffect } from "react";
import { getProjectTime } from "../../../../services/projectTimeServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";

const ProjectEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id, project } = useParams();
  const { currentUser } = useCurrentUserContext();
  const [projectTime, setProjectTime] = useState([]);

  const [projectTimeDetail, setProjectTimeDetail] = useState({
    total_time: 0,
    lead_name: "",
    editing_enabled: true,
    spent_time: 0,
    left_time: 0,
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      const getEditProjectDetails = {};
      setProjectTimeDetail((prev) => {
        return { ...prev, ...getEditProjectDetails };
      });
    }
  }, []);

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
          <button onClick={() => navigate(-1)}>
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
        <div>
          <h2>Team Management</h2>
          <div>
            <div className={styles.editing_project}>
              <label htmlFor="is_active">Editing Enabled</label>
              <div className={styles.is__active}>
                <input
                  className={styles.active__checkbox}
                  type="checkbox"
                  name={"is_active"}
                />
              </div>
            </div>
          </div>
          <div>
            <div className={styles.job__details}>
              <label htmlFor="lead_name">Lead Name</label>
              <input
                type="text"
                id="lead_name"
                name="lead_name"
                placeholder="Enter lead name"
              />
            </div>
            <div className={styles.job__details}>
              <label htmlFor="total_time">Total Time</label>
              <input
                type="text"
                id="total_time"
                name="total_time"
                placeholder="Enter total time"
              />
            </div>
          </div>
        </div>
        <button>Update</button>
      </div>
    </StaffJobLandingLayout>
  );
};

export default ProjectEdit;
