import "./style.scss";
import Socialmedia2 from "./assets/Socialmedia2.png";

const LoadingPage = () => {
  return (
    <>
      <div className="loading__page__container">
        <div className="e-albania">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            id="orbit"
          >
            <circle
              fill="none"
              stroke="#fff"
              strokeWidth="5"
              cx="50"
              cy="50"
              r="40"
            />
            {/*<circle fill="#EB1E51" cx="50" cy="50" r="24" />*/}
          </svg>
          <img src={Socialmedia2} alt="Socialmedia2" className="loadingPic" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            id="electron"
          >
            <circle fill="#34cc40" cx="5" cy="70" r="5" />
          </svg>
        </div>
        <p>Loading...</p>
      </div>
    </>
  );
};

export default LoadingPage;
