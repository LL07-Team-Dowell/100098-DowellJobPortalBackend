import "./style.css";
import TestComponent from "../../components/TestComponent/TestComponent";


const MainPage = () => {
    const links = [
        { to: "/admin", title: "Admin" },
        { to: "/research-jobs", title: "Research jobs" },
        {to:"/landingpage" ,  title:"Landing Page"}
    ]

    return <div className="main__Page__Container">
        <h1 className="center__Text">Main page</h1>
        <TestComponent links={links} />
    </div>
}

export default MainPage;
