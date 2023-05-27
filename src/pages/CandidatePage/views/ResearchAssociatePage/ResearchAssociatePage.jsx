import {useState , useEffect} from 'react' ; 
// Loading Component 
import Loading from './Loading';
import LittleLoading from './littleLoading';
// countries 
import {continentsData} from '../../utils/continentsData'
// images
import logo from "./images/logo.png"
import home from './icons/one.svg' ; 
import two from './icons/two.svg' ; 
import three from './icons/three.svg' ; 
import search from './icons/search.svg'; 
import selectorArrow from './icons/selectorArrow.svg'
import map from './images/map.png' ; 
import message from './icons/message.svg'
import cities from './images/cities.png'
// axios
import axios from 'axios'
// css
import "./style.css";
// AiOutlineHome TbSend MdOutlineNotifications
import {MdOutlineNotifications} from 'react-icons/md'
import {TbSend} from 'react-icons/tb'
import {AiOutlineHome} from 'react-icons/ai'

const ResearchAssociatePage = () => {
    // continents 
    const [continents , setContinents] = useState([]) ; 
    const [continentValue , setcontinentValue] = useState("") ; 
    // countries 
    const [countries , setCountries] = useState(continentsData) ; 
    const [countriesValue , setcountriesValue] = useState("") ; 
    const [disableCountrie , setdisableCountrie] = useState(true) ; 
    // regions 
    const [region , setRegion] = useState([]) ;  
    const [regionValue , setRegionValue] = useState("") ; 
    const [disableregion , setdisableregion ] = useState(true) ; 
    const [loadingRegion , setLoadingRegion] = useState(false)
    // fetching data
    useEffect(()=>{
        // continents
        axios("https://100074.pythonanywhere.com/continents/johnDoe123/haikalsb1234/100074/?format=json")
        .then(response => {console.log("continents: ",response.data) ; setContinents(response.data)})
        .catch(error => {console.log(error)})
        
    },[])
        // regions 

    useEffect(()=>{
        if(continentValue){
            setRegion([]) ;
            console.log("Loading")
            setLoadingRegion(true)
            axios(`https://100074.pythonanywhere.com/region/name/${countriesValue}/johnDoe123/haikalsb1234/100074/`)
            .then(response => {console.log("regions: ",response.data); setRegion(response.data) ; setLoadingRegion(false);setdisableregion(false)})
            .catch(error => {console.log("error") ; setRegion([]) ; setLoadingRegion(false);setdisableregion(false)})
        }
    },[countriesValue])

// disble element
    useEffect(()=>{
        if(continentValue)
            setdisableCountrie(false)
        if(countriesValue)
            setdisableregion(false)
    },[continentValue , countriesValue])

    
    return <div className={"research-jobs"}>
    <header>
        <div>
        <img className="logo" src={logo} alt="logo" />
        </div>
        <h3>Join Dowell Team as Research Associate </h3>
    </header>
    <nav className='research'>
        <ul>
            <li><span style={{margin:"auto"}}>< AiOutlineHome style={{fontSize:"40"}}/></span><span>Home</span></li>
            <li><span style={{margin:"auto"}}><TbSend style={{fontSize:"40"}}/></span> <span>Applied</span></li>
            <li><span style={{margin:"auto"}}><MdOutlineNotifications style={{fontSize:"40"}}/></span><span>Notifi</span></li>
        </ul>
    </nav>
    <main className='research'>
        {/* region could be back  */}
        {   (continents.length ) ? 
        <>
                    <div className="selections">
                    <div>
                        <h6>Continent Name:</h6>
                        <div className="input">
                        <div>
                        <img src={search} alt="" />
                        <select defaultValue={"Select continent"} placeholder="select an option" onChange={e => setcontinentValue(e.target.value)} >
                            <option disabled value="Select continent">Select continent</option>
                            {continents.map(continent => <option value={continent.name} key={continent.id}>{continent.name}</option>)}
                        </select>
                        </div>
                        <img src={selectorArrow} alt="" />
                        </div>
                    </div>
                    <div>
                        <h6>Country Name:</h6>
                        <div className="input">
                        <div>
                        <img src={search} alt="" />
                        <select defaultValue={"select a country"}   onChange={e => setcountriesValue(e.target.value)} disabled={disableCountrie}>
                            {
                                continentValue ? <>
                                <option value="select a country" disabled>select a country</option>
                                {countries[continentValue].map(continent => <option value={continent} key={continent}>{continent}</option>) }</>
                                : <option>Country</option>
                            }
                        </select>
                        </div>
                        <img src={selectorArrow} alt="" />
        
                        </div>
                    </div>
                    <div>
                        <h6>Region Name:</h6>
                        <div className="input">
                        
                                {
                                    loadingRegion ? <LittleLoading/> :
                                    <>
                                    <div>
                        <img src={search} alt="" />
                        <select defaultValue={"select a region"}   onChange={e => setRegionValue(e.target.value)} disabled={disableregion } >
                            <option value="select a region" disabled>select a region</option>
                            {region.map(continent => <option value={continent.name} key={continent.id}>{continent.name}</option>)}
                        </select>
                        </div>
                        <img src={selectorArrow} alt="" />
                                    </>
                                }
                        </div>
                    </div>
                </div>
                <div className="map__image">
                    
                </div>
                </>
                :
                <Loading/>
        }

        
        
        
    </main>
    </div>
}

export default ResearchAssociatePage;
