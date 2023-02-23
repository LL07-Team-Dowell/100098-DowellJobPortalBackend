import Socialmedia2 from "./assets/Socialmedia2.png";
import "./redirect.css";

const RedirectPage = () => {
  const handleRedirectClick = () => {
    window.location.href =
      "https://100093.pythonanywhere.com/?session_id=jghx23fnfb0pkkj8lan5yppe4p6o1qvl";
  };
  return (
    <>
      <div className="redirect-page">
        <img src={Socialmedia2} alt="Socialmedia2" />
        <p className="redirect">
          You Don't Have a Portfolio,{" "}
          <span onClick={handleRedirectClick} className="handle-redirect">Click Here</span>
        </p>
      </div>
    </>
  );
};

export default RedirectPage;

//jghx23fnfb0pkkj8lan5yppe4p6o1qvl
