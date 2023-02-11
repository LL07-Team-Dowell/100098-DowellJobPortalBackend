import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const NewSideNavigationBar = ({ links, runExtraFunctionOnNavItemClick }) => {
    
    const navigate = useNavigate();

    const handleNavItemClick = (e, addressToNavigateTo) => {
        e.preventDefault();
        
        if (runExtraFunctionOnNavItemClick && typeof runExtraFunctionOnNavItemClick === "function") runExtraFunctionOnNavItemClick();

        navigate(addressToNavigateTo)
    }

    return <>
        <div className="new__Side__Navigation__Bar">
            {
                !links || !Array.isArray(links) ? <></> :
            
                <ul className="new__Side__Navigation__Links">
                    <>
                        {
                            React.Children.toArray(links.map(link => {
                                if (!link.linkAddress) return <></>

                                return <li>
                                    <Link to={link.linkAddress} onClick={(e) => handleNavItemClick(e, link.linkAddress)}>
                                        {link.icon ? link.icon : <></>}
                                        {link.text ? <span>{link.text}</span> : <></>}
                                    </Link>
                                </li>
                            }))
                        }
                    </>
                </ul>
            }
        </div>
    </>
}

export default NewSideNavigationBar;