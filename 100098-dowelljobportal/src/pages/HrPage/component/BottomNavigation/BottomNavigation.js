import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import "./style.css";


const BottomNavigationBar = ({ updateNav, links }) => {
    const linksRef = useRef([]);
    const { section } = useParams();
    
    const handleClick = () => updateNav ? updateNav(false) : () => {};

    const addToLinksRef = (elem) => {
        if (elem && !linksRef.current.includes(elem)) linksRef.current.push(elem);
    } 

    useEffect(() => {

        if (linksRef.current.length < 1) return;

        linksRef.current.filter(linkRef => {
            if (linkRef.classList.contains("active")){
                linkRef.classList.remove("active");
            }
        })

        if (section == undefined) {
            linksRef.current[0].classList.add("active");
            return
        }

        linksRef.current.forEach(linkRef => {
            if (linkRef.href.includes(section)){
                linkRef.classList.add("active");
            }
        })

    }, [section])

    return <>
        <footer>
            <div className="hr__Bottom__Nav__Container">
                {
                    React.Children.toArray(links.map(link => {
                        return <>
                            <div className="bottom-navigation-item" onClick={handleClick}>
                                <Link ref={elem => addToLinksRef(elem)} to={`/${link.address.toLocaleLowerCase().replaceAll(' ', '_')}`}>
                                    {link.icon}
                                    {link.address ? link.address[0].toLocaleUpperCase() + link.address.slice(1) : ''}
                                </Link>
                            </div>
                        </>
                    }))
                }
            </div>
        </footer>
    </>
}

export default BottomNavigationBar;
