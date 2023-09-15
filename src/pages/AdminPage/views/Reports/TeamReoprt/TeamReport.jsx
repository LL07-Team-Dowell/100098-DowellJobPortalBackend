import React, { useEffect, useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { getAllOnBoardCandidate, generateindividualReport, generateReport, generateTeamReport } from "../../../../../services/adminServices";
import LoadingSpinner from "../../../../../components/LoadingSpinner/LoadingSpinner";
import { getAllTeams } from "../../../../../services/createMembersTasks";
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import { toast } from "react-toastify";
import { formatDateAndTime } from "../../../../../helpers/helpers";
import { AiOutlineClose } from "react-icons/ai";
import LittleLoading from "../../../../CandidatePage/views/ResearchAssociatePage/littleLoading";
import TeamReportChart from "./TeamReportChart";
import Select from "react-select";
import './index.scss'



export default function TeamReport() {
    const navigate = useNavigate();
    const [candidates, setcandidates] = useState([]);
    const [project, setProject] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [firstLoading, setFirstLoading] = useState(false);
    const [opendate, setOpenDate] = useState(false);
    const closeModal = () => {
        setOpenDate(false);
    };
    const [firstDate, setFirstDate] = useState(
        formatDateFromMilliseconds(new Date().getTime())
    );
    const [lastDate, setLastDate] = useState(
        formatDateFromMilliseconds(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
    );
    const [team_id, setTeamId] = useState("");
    const { currentUser } = useCurrentUserContext();
    const company_id = currentUser.portfolio_info[0].org_id;



    const handleSubmitDate = (start_date, end_date) => {
        setIsLoading(true)
        const data = {
            "report_type": "Team",
            "team_id": team_id,
            "start_date": start_date,
            "end_date": end_date
        }
        generateTeamReport(data)
            .then((resp) => {
                console.log(resp.data.response);
                setProject(resp.data.response)
                setFirstDate("")
                setLastDate("")
                setIsLoading(false)
                closeModal()
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
            });
    };

    useEffect(() => {
        setFirstLoading(true);
        getAllTeams(company_id)
            .then(
                ({
                    data: {
                        response: { data },
                    },
                }) => {
                    setcandidates(
                        data
                    );
                    setFirstLoading(false);
                }
            )
            .catch((err) => console.log(err));
    }, []);

    const handleTeam = (team_id) => {
        setTeamId(team_id);
        setOpenDate(true);
    }


    if (firstLoading)
        return (
            <StaffJobLandingLayout
                adminView={true}
                adminAlternativePageActive={true}
                pageTitle={"Team Report"}
            >
                <LoadingSpinner />
            </StaffJobLandingLayout>
        );
    return (
        <StaffJobLandingLayout
            adminView={true}
            adminAlternativePageActive={true}
            pageTitle={"Team Report"}
        >
            <div className="detailed_indiv_container">
                <button className="back" onClick={() => navigate(-1)}>
                    <MdArrowBackIosNew />
                </button>
                <div className="selction_container">
                    <p>Select Team</p>
                    <div className="role__Filter__Wrapper">
                        <IoFilterOutline />
                        <div className="select">
                            <Select
                                onChange={(selectedOption) => handleTeam(selectedOption.value)}
                                options={candidates.map((team) => ({
                                    value: team._id,
                                    label: `${team.team_name} - ${team.created_by ? `(${team.created_by})` : ""}`,
                                }))}
                            />
                        </div>


                    </div>
                </div>
            </div>
            <TeamReportChart data={project} />
            {
                opendate && <FormDatePopup
                    firstDate={firstDate}
                    lastDate={lastDate}
                    setFirstDate={setFirstDate}
                    setLastDate={setLastDate}
                    handleSubmitDate={handleSubmitDate}
                    closeModal={closeModal}
                    isLoading={isLoading}
                />

            }
        </StaffJobLandingLayout>
    );
}

const FormDatePopup = ({
    setFirstDate,
    setLastDate,
    firstDate,
    lastDate,
    handleSubmitDate,
    closeModal,
    isLoading
}) => {
    const handleFormSubmit = () => {
        if (firstDate && lastDate) {
            if (firstDate && lastDate) {
                handleSubmitDate(
                    formatDateFromMilliseconds(firstDate),
                    formatDateFromMilliseconds(lastDate)
                );
            } else {
                toast.error("the first or last date are not valid");
                console.log({
                    firstDate,
                    lastDate,
                    isValidDatefirstDate: isValidDate(firstDate),
                    isValidDateLastDate: isValidDate(lastDate),
                });
            }
        } else {
            toast.error("there is no first date or last date in ");
        }
    };
    return (
        <div className="overlay">
            <div className="form_date_popup_container">
                <div className="closebutton" onClick={() => closeModal()}>
                    <AiOutlineClose />
                </div>
                <label htmlFor="first_date">Start Date</label>
                <input
                    type="date"
                    id="first_date"
                    placeholder="mm/dd/yy"
                    onChange={(e) => setFirstDate(e.target.value)}
                />
                <label htmlFor="first_date">End Date</label>
                <input
                    type="date"
                    id="first_date"
                    placeholder="mm/dd/yy"
                    onChange={(e) => setLastDate(e.target.value)}
                />
                {
                    isLoading ? <LittleLoading /> : <button onClick={handleFormSubmit}>Generate</button>
                }
            </div>
        </div>
    );
};

function formatDateFromMilliseconds(milliseconds) {
    const dateObj = new Date(milliseconds);
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}


function isValidDate(inputDate) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const dateRegex =
        /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/(19\d\d|20\d\d|2023)$/;
    if (!dateRegex.test(inputDate)) {
        return false;
    }
    const [month, day, year] = inputDate.split("/").map(Number);
    if (month < 1 || month > 12) {
        return false;
    }
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        return false;
    }
    if (year !== currentYear && year !== currentYear - 1) {
        return false;
    }
    return true;
}