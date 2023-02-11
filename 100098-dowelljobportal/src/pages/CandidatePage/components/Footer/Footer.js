import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import './Footer.css';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useEffect } from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { RiSendPlaneLine } from 'react-icons/ri';
import { BsBell } from 'react-icons/bs';
import { BiUser } from 'react-icons/bi';
// import { makeStyles } from '@mui/styles';


// const useStyles = makeStyles(() => ({
//     root: {
//       color: "green",
//       "&$selected": {
//         color: "red"
//       }
//     },
//     selected: {}
//   }));




export default function SimpleBottomNavigation({ currentCategory }) {
  const [value, setValue] = React.useState(0);
  // const classes = useStyles();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  useEffect(() => {

    if ((!ref1.current) || (!ref2.current) ||(!ref3.current) ||(!ref4.current)) return;

    if ((window.location.href.split("#").length === 1) || (window.location.href.split("#")[1] === "/")){
      ref1.current.classList.add("footer__Link__Active");
      ref1.current.firstChild.classList.add("footer__Link__Active");
      return
    }

    [ref1, ref2, ref3, ref4].forEach(link => {
      if ( link.current.href.includes(window.location.href.split("#")[1]) || window.location.href.split("#")[1].split("/").length >= 2 && window.location.href.split("#")[1].split("/")[1] === link.current.href.split("#")[1].split("/")[1] ){
        link.current.classList.add("footer__Link__Active");
        link.current.firstChild.classList.add("footer__Link__Active");
        return;
      }

      if (window.location.href.includes("?") && link.current.href.split("?")[0].split("#")[1] === window.location.href.split("?")[0].split("#")[1]){
        link.current.classList.add("footer__Link__Active");
        link.current.firstChild.classList.add("footer__Link__Active");
        return
      }
    })

  }, [])

  return (
    <Box sx={{ width: 500 }}>
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'primary', zIndex: 2}} elevation={3}>
      <BottomNavigation
        showLabels
        style={{background:'#fff'}}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
    
      >

        <BottomNavigationAction
        style={{color: '#838383', activeColor:'#000000'}} label="Home" 
        icon={<AiOutlineHome  fontSize="24px"  color="#838383"/>}  component={Link} to={currentCategory ? `/jobs?jobCategory=${currentCategory}` : "/jobs"} ref={ref1}/>
        <BottomNavigationAction label="Applied" 
        style={{color: '#838383'}} 
        icon={<RiSendPlaneLine fontSize="24px" color="#838383"/>} component={Link} to={currentCategory ? `/applied?jobCategory=${currentCategory}` : "/applied"} ref={ref2}/>
        <BottomNavigationAction label="Alerts" 
        style={{color: '#838383'}} 
        icon={<BsBell fontSize="24px" color="#838383"/>} component={Link} to={currentCategory ? `/alerts?jobCategory=${currentCategory}` : "/alerts"} ref={ref3}/>
        <BottomNavigationAction label="user" 
        style={{color: '#838383'}} 
        icon={<BiUser fontSize="24px" color="#838383" /> } component={Link} to={currentCategory ? `/user?jobCategory=${currentCategory}` : "/user"} ref={ref4}/>


      </BottomNavigation>
      </Paper>
    </Box>
  );
}
