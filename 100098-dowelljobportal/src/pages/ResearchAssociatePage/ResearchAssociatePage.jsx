import "./style.css";
import logo from "./images/logo.png"
import home from './icons/one.svg' ; 
import two from './icons/two.svg' ; 
import three from './icons/three.svg' ; 
import search from './icons/search.svg'; 
import selectorArrow from './icons/selectorArrow.svg'
import map from './images/map.png' ; 
import message from './icons/message.svg'
const ResearchAssociatePage = () => {
    return <div className={"research-jobs"}>
    <header>
        <div>
        <img className="logo" src={logo} alt="logo" />
        </div>
        <h3>Join Dowell Team as Research Associate </h3>
    </header>
    <nav>
        <ul>
            <li><img src={home} alt="" /> <span>Home</span></li>
            <li><img src={two} alt="" /> <span>Applied</span></li>
            <li><img src={three} alt="" /> <span>Notifi</span></li>
        </ul>
    </nav>
    <main>
        <div className="selections">
            <div>
                <h6>Country Name:</h6>
                <div className="input">
                <div>
                <img src={search} alt="" />
                <select placeholder="select an option" name="" id="">
                    <option value="">select an option</option>
                    <option value="">asd asd </option>
                    <option value="">asdasd </option>
                    <option value="">asdasd</option>
                    <option value="">asdqw</option>
                </select>
                </div>
                <img src={selectorArrow} alt="" />

                </div>
            </div>
            <div>
                <h6>City Name:</h6>
                <div className="input">
                <div>
                <img src={search} alt="" />
                <select placeholder="select an option" name="" id="">
                    <option value="">select an option</option>
                    <option value="">asd asd </option>
                    <option value="">asdasd </option>
                    <option value="">asdasd</option>
                    <option value="">asdqw</option>
                </select>
                </div>
                <img src={selectorArrow} alt="" />

                </div>
            </div>
        </div>
        
        <img src={map} className="map-image" alt="" />
        
    </main>
    <img src={message} alt=""  className="message"/>
    </div>
}

export default ResearchAssociatePage;
