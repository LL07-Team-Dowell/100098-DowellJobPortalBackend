import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import "./style.css";


const NavigationBar = ({ className, title, showCandidate, setShowCandidate, showCandidateTask, setShowCandidateTask, handleMenuIconClick, handleBackIconClick, changeToBackIcon }) => {
    return <>
        <nav>
            <div className={`navbar-container ${className ? className : ''}`}>
                {
                    changeToBackIcon ? <ArrowBackIcon className="navbar-icon" onClick={handleBackIconClick} /> :

                    showCandidate ? <ArrowBackIcon className="navbar-icon" onClick={() => setShowCandidate(false)} /> :

                    showCandidateTask ? <ArrowBackIcon className="navbar-icon" onClick={() => setShowCandidateTask(false)} /> : <>
                
                        <div className='menu__Icon__Container'>
                            <MenuIcon className="navbar-icon" onClick={handleMenuIconClick} />
                            {title && <h2>{title}</h2>}
                        </div>
                        <NotificationsNoneIcon className="navbar-icon" />
                    </>
                }
            </div>
        </nav>
    </>
}

export default NavigationBar;
