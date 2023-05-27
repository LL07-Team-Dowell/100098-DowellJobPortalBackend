import React, { useEffect } from 'react';
import { dowellLogoutUrl } from '../../services/axios';

function Logout() {

  useEffect(() => {

    sessionStorage.clear();
    window.location.href = dowellLogoutUrl;
      
  }, [])
    
  return (
    <></>
  )
}

export default Logout