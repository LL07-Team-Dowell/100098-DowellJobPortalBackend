import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './styles.module.css';
import { BiListCheck, BiSolidSelectMultiple } from 'react-icons/bi';
import Button from '../../../../AdminPage/components/Button/Button';
import { toast } from 'react-toastify';


const BatchApproveModal = ({ 
    batchApprovalLoading, 
    handleCloseModal,
    logs,
    handleApproveSelected,
}) => {

    const [ selectedLogs, setSelectedLogs ] = useState([]);

    const handleAddLog = (logId) => {
        setSelectedLogs(prevLogs => {
            return [...prevLogs, logId]
        })
    }

    const handleRemoveLog = (logId) => {
        setSelectedLogs(selectedLogs.slice().filter(log => log !== logId))
    }

    const handleSelectLog = (log) => {
        const logAlreadySelected = selectedLogs.slice().includes(log?.single_task_id);
        
        if (logAlreadySelected) return handleRemoveLog(log?.single_task_id) 
        
        handleAddLog(log?.single_task_id)
    }
    

    const handleSelectAll = () => {
        const remainingItemsToBeSelected = logs.filter(log => !selectedLogs.slice().includes(log?.single_task_id));
        setSelectedLogs((prevLogs) => {
            return [...prevLogs, ...remainingItemsToBeSelected.map(log => log?.single_task_id)]
        })
    }

    const handleUnselectAll = () => {
        setSelectedLogs([]);
    }

    return <>
        <div className={styles.approve__Overlay}>
            <div className={styles.approve__Modal}>
                <div className={styles.approve__Modal__CLose__Container}>
                    <AiOutlineClose 
                        className={styles.approve__Modal__CLose__Icon} 
                        onClick={
                            batchApprovalLoading ? () => {}
                            :
                            () => handleCloseModal()
                        }
                    />
                </div>
                <div className={styles.approve__Modal__Content}>
                    <h2>Batch Log Approval</h2>
                    <Button
                        text={
                            logs.filter(log => !selectedLogs.slice().includes(log?.single_task_id)).length < 1 ?
                                "Unselect all"
                            :
                            "Select all"
                        }
                        icon={<BiSolidSelectMultiple />}
                        handleClick={
                            logs.filter(log => !selectedLogs.slice().includes(log?.single_task_id)).length < 1 ?
                            () => handleUnselectAll()
                            :

                            () => handleSelectAll()
                        }
                        className={styles.select__All__Btn}
                        isDisabled={batchApprovalLoading ? true : false}
                    />
                    <p className={styles.title}>
                        <span>Work Logs Pending Approval: {Number(logs?.length)}</span>
                        <span className={styles.selection__Count}>Logs selected for approval: {selectedLogs.length}</span>
                    </p>
                    <div className={styles.logs__Wrapper}>
                        {
                            logs.length < 1 ? <p>No logs to approve</p>
                            :
                            React.Children.toArray(logs.map(log => {
                                return <>
                                    <div className={styles.log__Item}>
                                        <label htmlFor={log?.single_task_id}>
                                            <input 
                                                type={'checkbox'} 
                                                id={log?.single_task_id} 
                                                checked={selectedLogs.slice().includes(log?.single_task_id) ? true : false}
                                                onChange={() => handleSelectLog(log)}
                                            />
                                            <div>
                                                <p>
                                                    {log?.task}
                                                    {' from '}
                                                    <span>{log?.start_time}</span> 
                                                    {' to '}
                                                    <span>{log?.end_time}</span>
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </>
                            }))
                        }
                    </div>
                    {
                        logs.length > 0 ?
                        <Button
                            text={
                                batchApprovalLoading ? 
                                    "Approving..." 
                                : 
                                "Approve selected"
                            }
                            icon={<BiListCheck />}
                            handleClick={
                                selectedLogs.length < 1 ? () => toast.info('Please select at least one work log')
                                :
                                batchApprovalLoading ? () => {}
                                :

                                () => handleApproveSelected(selectedLogs)
                            }
                            className={`${styles.select__All__Btn} ${styles.approve__Btn}`}
                            isDisabled={batchApprovalLoading ? true : false}
                        />
                        :
                        <></>
                    }
                </div>
            </div>
        </div>
    </>
}

export default BatchApproveModal;