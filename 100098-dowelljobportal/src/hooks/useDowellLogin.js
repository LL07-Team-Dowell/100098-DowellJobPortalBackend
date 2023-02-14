import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getUserInfoFromLoginAPI, getUserInfoFromPortfolioAPI } from "../services/authServices";
import { dowellLoginUrl } from "../services/axios";

export default function useDowellLogin ( updateCurrentUserState , updatePageLoading ) {
    
    const [searchParams, setSearchParams] = useSearchParams();
    const currentLocalSessionId = sessionStorage.getItem("session_id");
    const currentLocalPortfolioId = sessionStorage.getItem("id");
    
    useEffect(() => {
        
        const session_id = searchParams.get("session_id");
        const portfolio_id = searchParams.get("id");

        if ((!session_id) && (!portfolio_id)) {
            if ((currentLocalSessionId) && (currentLocalPortfolioId)) {
                getUserInfoFromPortfolioAPI({ session_id:  currentLocalSessionId }).then(res => {
                    const currentUserDetails = res.data;
                    updateCurrentUserState(currentUserDetails);
                    updatePageLoading(false);
                }).catch(err => {
                    console.log(err);
                    updatePageLoading(false);
                })
                return
            }

            if ((currentLocalSessionId) && (!currentLocalPortfolioId)) {
                getUserInfoFromLoginAPI({ session_id:  currentLocalSessionId }).then(res => {
                    const currentUserDetails = res.data;
                    updateCurrentUserState(currentUserDetails);
                    updatePageLoading(false);
                }).catch(err => {
                    console.log(err);
                    updatePageLoading(false);
                })
                return
            }

            return window.location.href = dowellLoginUrl;
        }
        
        sessionStorage.setItem("session_id", session_id);

        if ((session_id) && (!portfolio_id)) {
            getUserInfoFromLoginAPI({ session_id:  session_id }).then(res => {
                const currentUserDetails = res.data;
                updateCurrentUserState(currentUserDetails);
                updatePageLoading(false);
            }).catch(err => {
                console.log(err);
                updatePageLoading(false);
            })
            return
        }

        sessionStorage.setItem("portfolio_id", portfolio_id);
        
        getUserInfoFromPortfolioAPI({ session_id:  session_id }).then(res => {
            const currentUserDetails = res.data;
            updateCurrentUserState(currentUserDetails);
            updatePageLoading(false);
        }).catch(err => {
            console.log(err);
            updatePageLoading(false);
        })

    }, [])

}
