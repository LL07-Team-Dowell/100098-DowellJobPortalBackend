import "./style.css";
import dowellLogo from "../../pages/Redirectpage/assets/Socialmedia2.png";


export const PageUnderConstruction = ({ showProductView }) => {
    return <div className="construction__Page__Container">
        {
            showProductView && <img src={dowellLogo} alt="dowell" className="logo" />
        }
        <img src={process.env.PUBLIC_URL + '/under-constructions.svg'} alt='page under construction' />
        {
            showProductView && <>
                <h2>Product currently under maintenance</h2>
                <p>We apologize for any inconvenience caused</p>
            </>
        }
    </div>
}
