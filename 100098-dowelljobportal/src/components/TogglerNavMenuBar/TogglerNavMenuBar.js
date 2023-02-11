import React from "react";
import "./style.css";

const TogglerNavMenuBar = ({ menuItems, className, handleMenuItemClick, currentActiveItem }) => {
    if (!menuItems || !Array.isArray(menuItems)) return <></>

    return <div className={`toggler_Nav_Container ${className ? className : ''}`}>
        {
            React.Children.toArray(menuItems.map(item => {
                return <div className={`toggler_Nav_Item ${currentActiveItem === item ? 'active' :  typeof item === "object" && item.text ? currentActiveItem === item.text ? 'active' : '' : ''}`} onClick={handleMenuItemClick ? () => handleMenuItemClick(item) : () => {}}>
                    <span>{typeof item === "object" && item.icon ? item.icon : item}</span>
                </div>
            }))
        }
    </div>
}

export default TogglerNavMenuBar;