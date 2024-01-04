import userNotFoundImage from "../../../../assets/images/user-not-found.jpg";

const CurrentJobNotFound = () => {
    return (
      <div
        className="current_job_not_found_container"
        style={{ position: "absolute", top: "50%", left: "50%" }}
      >
        <img
          className="current_job_not_found_container_image"
          src={userNotFoundImage}
          alt=""
          style={{ width: 600 }}
        />
        <p className="current_job_not_found_container_paragraph">
          This job listing is no longer available
        </p>
      </div>
    );
};

export default CurrentJobNotFound;