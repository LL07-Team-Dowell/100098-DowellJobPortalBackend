import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./style.css";

const NavigationItemSelection = ({ items, searchParams }) => {
    const linksRef = useRef([]);
    
    
    useEffect(() => {
        
        const currentTab = searchParams.get("tab");

        if (linksRef.current.length < 1) return;
        
        linksRef.current.filter(linkRef => {
            if (linkRef.parentElement.classList.contains("active")){
                linkRef.parentElement.classList.remove("active");
            }
        })

        if (currentTab == null) {
            linksRef.current[0].parentElement.classList.add("active")
            return
        };

        linksRef.current.forEach(linkRef => {
            if ( currentTab === linkRef.href.split("=")[1] ) {
                linkRef.parentElement.classList.add("active")
            }
            return
        })

    }, [searchParams]);

    const addToLinksRef = (elem) => {
        if (elem && !linksRef.current.includes(elem)) linksRef.current.push(elem);
    }
    
    return <>
        <div className="item-selection-container">
            {
                items ? React.Children.toArray(items.map((item, index) => {
                    return <>
                    <div className="item-selection-item">
                        <Link to={`?tab=${item.toLocaleLowerCase()}`} ref={elem => addToLinksRef(elem)}><span>{ item }</span></Link>
                        <span className="item-selection-indicator"></span>
                    </div>
                    
                    </>
                })): <></>
            }
        </div>
    </>
}

export default NavigationItemSelection;
