import styles from "./styles.module.css";
import { AiOutlineClose } from "react-icons/ai";

const ProjectTimeModal = ({ handleCloseModal, handleChange }) => {
  return (
    <>
      <div className={styles.share__Overlay}>
        <div className={styles.share__Modal}>
          <div className={styles.share__Modal__CLose__Container}>
            <AiOutlineClose
              className={styles.share__Modal__CLose__Icon}
              onClick={handleCloseModal}
            />
            <h2>Edit Project time</h2>
            <div style={{ marginTop: "1.5rem", color: "#006543" }}>
              <h3>Team management</h3>
            </div>
            <div className="state_of_job">
              <label htmlFor="is_active">Editing</label>
              <div className="is_active">
                <input
                  className="active_checkbox"
                  type="checkbox"
                  name={"is_active"}
                  onChange={(e) =>
                    handleChange(e.target.checked, e.target.name)
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="lead_name">Lead Name</label>
              <input
                type={"text"}
                name={"lead_name"}
                placeholder={"Enter lead Name"}
              />

              <label htmlFor="total_time">Total time</label>
              <input
                type={"text"}
                name={"total_time"}
                placeholder={"Enter Total Time"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectTimeModal;
