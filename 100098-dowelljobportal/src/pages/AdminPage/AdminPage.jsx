import TestComponent from "../../components/TestComponent/TestComponent";
import "./style.css";


const AdminPage = () => {
    const links = [
        { to: "add", title: "Add new job" },
        { to: "view", title: "View job" },
        { to: "edit", title: "Edit job" },
    ]

    return <>
        <h1 className="center__Text">Admin page</h1>
        <TestComponent links={links} />
    </>
}

export default AdminPage;
