import HorizontalBarLoader from "../HorizontalBarLoader/HorizontalBarLoader"
import authLogin from '../../assets/images/auth-login.jpg';
import styles from './styles.module.css';
import { useState } from "react";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { teamManagementProductName } from "../../utils/utils";
import { generateAuthToken } from "../../services/authServices";
import { toast } from "react-toastify";


const AuthOverlay = () => {
    const { currentUser, setCurrentAuthSessionExpired } = useCurrentUserContext();
    const [ refreshLoading, setRefreshLoading ] = useState(false);

    const handleRefresh = async () => {
        if (!currentUser) return

        setRefreshLoading(true);

        const foundOwnerProductInPortfolio = currentUser?.portfolio_info?.find(
            (item) => item.product === teamManagementProductName &&
              item.member_type === 'owner'
        )

        try {
            const { access_token } = (await generateAuthToken({
                "username": currentUser?.userinfo?.username,
                "portfolio": foundOwnerProductInPortfolio ? 
                    foundOwnerProductInPortfolio?.portfolio_name 
                    : 
                    currentUser?.portfolio_info[0]?.portfolio_name,
                "data_type": foundOwnerProductInPortfolio ? 
                    foundOwnerProductInPortfolio?.data_type 
                    : 
                    currentUser?.portfolio_info[0]?.data_type,
                "company_id": foundOwnerProductInPortfolio ? 
                    foundOwnerProductInPortfolio?.org_id 
                    : 
                    currentUser?.portfolio_info[0]?.org_id,
            })).data;
    
            sessionStorage.setItem('token', access_token);

            setTimeout(() => {
                setRefreshLoading(false)
                setCurrentAuthSessionExpired(false)
                toast.success('Login session successfully refreshed');
            }, 1500)

        } catch (error) {
            console.log(error);
            setRefreshLoading(false);
            toast.error('An error occured while trying to refresh your session. Please try again');
        }
        
    }

    return <>
        <div className={styles.auth__overlay}>
          <div className={styles.auth__Container}>
            <h2>Oops, your login session has expired</h2>
            <img 
              src={authLogin}
              alt="login illustration"
            />
            {
                refreshLoading ? 
                    <HorizontalBarLoader width={'7rem'} height={'1.7rem'} />
                :
                <button onClick={handleRefresh}>
                    Refresh Now
                </button>
            }
          </div>
        </div>
    </>
}

export default AuthOverlay;