import { Link } from "react-router-dom";
import "./style.css";
import notFoundImage from "../../assets/images/user-not-found.jpg";


const ErrorPage = () => {
    return <>

        <div className="error__Page__Container">
            {/* <img src={process.env.PUBLIC_URL + "/404-page-not-found.svg"} alt="404 page not found" /> */}
            <img src={notFoundImage} alt="404 page not found" />
        </div>

        <h2 className="page__Not__Found">Page not found</h2>

        <Link to={'/'}>
            Go Home
        </Link>

    </>
}

export default ErrorPage;
