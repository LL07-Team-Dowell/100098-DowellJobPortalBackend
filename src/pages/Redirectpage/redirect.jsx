import { useEffect, useState } from "react";

import Socialmedia2 from "./assets/Socialmedia2.png";
import "./redirect.css";

const RedirectPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const [redirectOverlay, setRedirectOverlay] = useState(false);

  useEffect(() => {
    //get session Id from session storage
    const sessionId = sessionStorage.getItem("session_id");
    if (sessionId) {
      setSessionId(sessionId);
    }
  }, []);

  const handleRedirectClick = () => {
    sessionStorage.clear();
    setRedirectOverlay(true);
    window.location.replace(
      `https://100093.pythonanywhere.com/?session_id=${sessionId}`
    );
  };

  return (
    <>
      {redirectOverlay && <div className="redirect__overlay"></div>}
      <div className="redirect__page">
        <img src={Socialmedia2} alt="Socialmedia2" className="socialmediaimg" />
        <p className="redirect">
          You Don't Have a Portfolio,
          <span
            onClick={() => handleRedirectClick()}
            className="handle__redirect"
          >
            Click Here
          </span>
        </p>
      </div>
    </>
  );
};

export default RedirectPage;

//jghx23fnfb0pkkj8lan5yppe4p6o1qvl
