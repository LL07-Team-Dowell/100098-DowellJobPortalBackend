import React, { useState } from "react";
import styles from './styles.module.css';
import { toast } from "react-toastify";
import Select from 'react-select';
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { requestToUpdateTask } from "../../../../services/candidateServices";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Overlay from "../../../../components/Overlay";
import { formatDateAndTime } from "../../../../helpers/helpers";


function LogRequest({ projects, updatetaskdate, setShowModal }) {
    const { currentUser } = useCurrentUserContext();
    const [formData, setFormData] = useState({
        company_id: currentUser?.portfolio_info[0]?.org_id,
        username: currentUser.userinfo.username,
        update_task_date: updatetaskdate,
        portfolio_name: currentUser?.portfolio_info[0]?.portfolio_name,
        project: "",
        update_reason: ""
    });
    const [ loading, setLoading ] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.update_reason.length < 1) return toast.warning("Please enter a reason!");
        if (formData.project.length < 1) return toast.warning("Please select a project!");

        setLoading(true);

        try {
            const resp = await requestToUpdateTask(formData);
            console.log("Response Data:", resp);
            setFormData({
                update_reason: ""
            })
            toast.success("Task request update created successfully!")
            setShowModal(false);
            setLoading(false);
        } catch (error) {
            toast.warning(
                error.response
                    ? error.response.status === 500
                    ? 'Failed to add task request'
                    : error.response.data.message
                    : 'Failed to add task request'
            );
            setLoading(false);
        }

    };


    return (
        <Overlay>
            <div className={styles.update_task}>
                <h3>Submit log request for {formatDateAndTime(updatetaskdate, true)}</h3>
                <form onSubmit={handleSubmit}>
                    <div className={styles.form__Item}>
                        <label htmlFor="age">Update Date</label>
                        <input
                            type="text"
                            id="age"
                            name="age"
                            value={updatetaskdate}
                            disabled={true}
                        />
                    </div>
                    <div className={styles.form__Item}>
                        <label htmlFor="project">Select project</label>
                        <Select 
                            value={{ label: formData.project, value: formData.project }}
                            options={projects?.map(project => {
                                return { label: project, value: project }
                            })}
                            onChange={({ value }) => setFormData(prevData => {
                                return {
                                    ...prevData,
                                    project: value,
                                }
                            })}
                            className={styles.react__Select}
                            name="project"
                            placeholder='Select project'
                        />
                    </div>
                    <div className={styles.form__Item}>
                        <label htmlFor="description">Reason why you failed to update:</label>
                        <textarea
                            id="description"
                            name="update_reason"
                            value={formData.update_reason}
                            onChange={handleChange}
                            style={{ resize: 'none', padding: "0.2rem 0.5rem" }}
                        >
                        </textarea>
                    </div>
                    <div className={styles.request_buttons}>
                        <button 
                            disabled={loading ? true : false}
                        >
                            {
                                !loading ? 
                                    'Submit'
                                :
                                <LoadingSpinner width={'1.5rem'} height={'1.5rem'} color={'white'} />
                            }
                        </button>
                        <button 
                            className={styles.cancel} 
                            onClick={() => setShowModal(false)} 
                            disabled={loading ? true : false}
                        >
                            Cancel
                        </button>
                    </div>
                </form >
            </div >
        </Overlay>
    );
}

export default LogRequest;
