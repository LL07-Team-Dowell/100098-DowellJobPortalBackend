import React from 'react'
import { PageUnderConstruction } from '../../../UnderConstructionPage/ConstructionPage';
import { useNavigate } from 'react-router-dom';
import "./style.css";
import TitleNavigationBar from '../../../../components/TitleNavigationBar/TitleNavigationBar';

function AlertScreen() {
  const navigate = useNavigate();

  return (
    <div className='candidate__Alerts__Page'>
      <TitleNavigationBar title={"Alerts"} handleBackBtnClick={() => navigate(-1)} />
      <PageUnderConstruction />
    </div>
  )
}

export default AlertScreen