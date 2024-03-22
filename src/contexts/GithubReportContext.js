import { createContext, useContext, useEffect, useState } from "react";
import { getCommits } from "../services/projectTimeServices";

const GithubReportContext = createContext({});

export const useGithubContext = () => useContext(GithubReportContext);

export default function GithubReportContextProvider({ children }) {
    const [ githubReports, setGithubReports ] = useState([]);
    const [ githubReportsLoading, setGithubReportsLoading ] = useState(true);
    const [ githubReportsLoaded, setGithubReportsLoaded ] = useState(false);

    useEffect(() => {
        if (githubReportsLoaded) return setGithubReportsLoading(false);

        getCommits().then(res => {
            console.log(res.data?.data);

            setGithubReports(Array.isArray(res.data?.data) ? res.data?.data : []);
            setGithubReportsLoaded(true);
            setGithubReportsLoading(false);

        }).catch(err => {
            console.log(err?.reponse?.data);
            setGithubReportsLoading(false);
        })

    }, [githubReportsLoaded])
    
    return <>
        <GithubReportContext.Provider value={{
            githubReports,
            githubReportsLoaded,
            githubReportsLoading,
        }}>
            { children }
        </GithubReportContext.Provider>
    </>
}