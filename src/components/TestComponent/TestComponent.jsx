import React from "react";
import { Link } from "react-router-dom";
import "./style.css";


const TestComponent = ({ links }) => {
    return <>
        <div className="test__Navbar">
            {
                React.Children.toArray(links.map(link => {
                    return <Link to={link.to}>{link.title}</Link>
                }))
            }
        </div>
    </>
}

export default TestComponent;
