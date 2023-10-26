import { useEffect } from "react";
import { getAuthStatus } from "../services/authServices";
import { toast } from "react-toastify";

export default function useCheckCurrentAuthStatus (userDetails, updateCurrentAuthSessionStatus) {

    useEffect(() => {
        if (!userDetails) return

        // GET USER'S CURRENT AUTH STATUS
        getAuthStatus({
            name: `${userDetails?.userinfo?.first_name} ${userDetails?.userinfo?.last_name}`,
            email: userDetails?.userinfo?.email,
        }).then(res => {
            // STILL AUTHORIZED
            console.log('User still authorized');
            updateCurrentAuthSessionStatus(false);
        }).catch(err => {
            // unauthorized
            console.log('User no longer authorized');
            updateCurrentAuthSessionStatus(true);
            toast.info('Login session expired.')
        });

    }, [userDetails])
}
