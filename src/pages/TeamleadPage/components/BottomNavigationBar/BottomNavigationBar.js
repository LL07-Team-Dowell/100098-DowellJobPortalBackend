import { useEffect, useRef } from "react";
import { FiHome, FiUser } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import { TbFolderX } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";

import "./style.css";


const BottomNavigationBar = ({ updateNav, firstLink, secondLink, thirdLink, changeSecondIcon }) => {
    const linksRef = useRef([]);
    const { section } = useParams();
    
    const handleClick = () => updateNav(false);

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
            <div className="bottom-nav-container">
                <div className="bottom-navigation-item" onClick={handleClick}>
                    <Link ref={elem => addToLinksRef(elem)} to={`/${firstLink.toLocaleLowerCase()}`}>
                        <FiHome />
                        {firstLink ? firstLink[0].toLocaleUpperCase() + firstLink.slice(1) : ''}
                    </Link>
                </div>
                <div className="bottom-navigation-item" onClick={handleClick}>
                    <Link ref={elem => addToLinksRef(elem)} to={`/${secondLink.toLocaleLowerCase()}`}>
                        {changeSecondIcon ? <TbFolderX /> : <ImStack />}
                        {secondLink ? secondLink[0].toLocaleUpperCase() + secondLink.slice(1) : ''}
                    </Link>
                </div>
                <div className="bottom-navigation-item" onClick={handleClick}>
                    <Link ref={elem => addToLinksRef(elem)} to={`/${thirdLink.toLocaleLowerCase()}`}>
                        <FiUser />
                        {thirdLink ? thirdLink[0].toLocaleUpperCase() + thirdLink.slice(1) : ''}
                    </Link>
                </div>
            </div>
        </footer>
    </>
}

export default BottomNavigationBar;
