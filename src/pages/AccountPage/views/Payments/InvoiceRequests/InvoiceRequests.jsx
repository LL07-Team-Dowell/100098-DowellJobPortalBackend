import { useNavigate } from "react-router-dom";
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"
import styles from "./styles.module.css";
import { IoChevronBack } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { createNewInvoiceRequest, getInvoiceRequest } from "../../../../../services/paymentService";
import LoadingSpinner from "../../../../../components/LoadingSpinner/LoadingSpinner";
import Select from 'react-select';
import Overlay from "../../../../../components/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import { extractMonthandYear, formatDateForAPI } from "../../../../../helpers/helpers";
import { useMediaQuery } from "@mui/material";
import { toast } from "react-toastify";


const AccountsInvoiceRequests = () => {  
    const { 
        currentUser,
        allCompanyApplications,
        userRemovalStatusChecked,
    } = useCurrentUserContext();

    const initialNewRequestData = {
        "username": "",
        "portfolio_name": "",
        "user_id": "",
        "company_id": currentUser?.portfolio_info[0]?.org_id,
        "created_by": currentUser?.userinfo?.username,
        "data_type": currentUser?.portfolio_info[0]?.data_type,
        "payment_month": "",
        "payment_year": "",
        "payment_from": "",
        "payment_to": "",
    }
    
    const navigate = useNavigate();

    const [ invoiceRequests, setInvoiceRequests ] = useState([]);
    const [ invoiceRequestsLoading, setInvoiceRequestsLoading ] = useState(false);
    const [ invoiceRequestsLoaded, setInvoiceRequestsLoaded ] = useState(false);
    const [ newInvoiceRequest, setNewInvoiceRequest ] = useState(initialNewRequestData);
    const [ newInvoiceRequestLoading, setNewInvoiceRequestLoading ] = useState(false);
    const [ selectedUser, setSelectedUser ] = useState(null);
    const [ requestsForSelectedUser, setRequestsForSelectedUser ] = useState([]);
    const [ availableUsers, setAvailableUsers ] = useState([]);
    const [ showNewRequestModal, setShowNewRequestModal ] = useState(false);
    const [ selectedUserForNewRequest, setSelectedUserForNewRequest ] = useState(null);
    
    const isSmallScreen = useMediaQuery('(max-width: 767px)');

    const handleUpdateNewInvoiceRequest = (name, val) => {
        setNewInvoiceRequest((prevVal) => {
            return {
                ...prevVal,
                [name]: val,
            }
        })
    }

    const handleFromDateChange = (e) => {
        const fromDate = e.target.value;
        handleUpdateNewInvoiceRequest(e.target.name, formatDateForAPI(fromDate));
    
        //Calculate the "Payment To" date 6 days ahead
        const toDate = new Date(
          new Date(fromDate).setDate(new Date(fromDate).getDate() + 6)
        );

        handleUpdateNewInvoiceRequest('payment_to', formatDateForAPI(toDate));
    };
    
    const handleToDateChange = (e) => {
        handleUpdateNewInvoiceRequest(e.target.name, formatDateForAPI(e.target.value));
    };    
    
    useEffect(() => {

        if (invoiceRequestsLoaded) return;

        setInvoiceRequestsLoading(true);

        getInvoiceRequest(currentUser?.portfolio_info[0]?.org_id).then(res => {
            console.log(res.data?.response);

            setInvoiceRequests(res.data?.response);
            setInvoiceRequestsLoaded(true);
            setInvoiceRequestsLoading(false);

        }).catch(err => {
            console.log(err?.response?.data);
            setInvoiceRequestsLoading(false);
        })

    }, [invoiceRequestsLoaded])

    useEffect(() => {
        if (!userRemovalStatusChecked) return

        setAvailableUsers(allCompanyApplications.filter(application => application.user_id));

    }, [userRemovalStatusChecked, allCompanyApplications])

    useEffect(() => {

        if (!selectedUser) return setRequestsForSelectedUser([]);

        const foundUser = availableUsers.find(user => user._id === selectedUser);
        if (!foundUser) return setRequestsForSelectedUser([]);

        setRequestsForSelectedUser(
            invoiceRequests.filter(request => 
                request?.username === foundUser.username &&
                request?.company_id === foundUser.company_id &&
                request?.portfolio_name === foundUser.portfolio_name &&
                request?.user_id === foundUser.user_id
            )
        );

    }, [selectedUser, availableUsers, invoiceRequests])

    const handleCloseRequestModal = () => {
        setNewInvoiceRequest(initialNewRequestData);
        setShowNewRequestModal(false);
    }

    const handleCreateNewRequest = async () => {
        if (newInvoiceRequestLoading) return;

        if (
            newInvoiceRequest.username.length < 1 ||
            newInvoiceRequest.portfolio_name.length < 1 ||
            newInvoiceRequest.user_id.length < 1
        ) return toast.info('Please select a user');

        if (newInvoiceRequest.payment_from.length < 1) return toast.info('Please select a payment from date');
        if (newInvoiceRequest.payment_to.length < 1) return toast.info('Please select a payment to date');

        if (new Date(newInvoiceRequest.payment_from).getTime() > new Date(newInvoiceRequest.payment_to).getTime()) return toast.info('Payment from date should be before payment to date');
        
        const { month, year } = extractMonthandYear(newInvoiceRequest.payment_from);

        newInvoiceRequest.payment_month = month;
        newInvoiceRequest.payment_year = year;

        const copyOfInvoiceRequests = invoiceRequests.slice();
        setNewInvoiceRequestLoading(true);

        try {
            const res = (await createNewInvoiceRequest(newInvoiceRequest)).data;
            console.log(res);

            setNewInvoiceRequestLoading(false);

            copyOfInvoiceRequests.push(res?.inserted_data);
            setInvoiceRequests(copyOfInvoiceRequests);
            
            handleCloseRequestModal();
            toast.success('Successfully created new invoice request!');
        } catch (error) {
            console.log(error?.response ? error?.response?.data?.message : error?.message);
            toast.error(error?.response ? error?.response?.data?.message : error?.message);
            setNewInvoiceRequestLoading(false);
        }
    }

    return <>
        <StaffJobLandingLayout
            accountView={true}
            hideSearchBar={true}
        >
            <div className={styles.wrapper}>
                <div className={styles.top__Wrap}>
                    <div className={styles.icon__Wrap}>
                        <div className={styles.back_icon} onClick={() => navigate(-1)}>
                            <IoChevronBack />
                        </div>
                        <h3>Invoice Requests</h3>
                    </div>
                    <button
                        className={styles.new__Request__Btn}
                        disabled={newInvoiceRequestLoading}
                        onClick={() => setShowNewRequestModal(true)}
                    >
                        {'+ New'}
                    </button>
                </div>
                <div className={styles.user__Filter}>
                    <p>Filter by user</p>
                    <Select 
                        value={
                            selectedUser ?
                                {
                                    label: availableUsers?.find(user => user?._id === selectedUser)?.applicant,
                                    value: selectedUser,
                                }
                            :
                            null
                        }
                        onChange={(val) => setSelectedUser(val.value)}
                        options={
                            availableUsers.map(user => {
                                return {
                                    label: user?.applicant,
                                    value: user?._id,
                                }
                            })
                        }
                        className={styles.select__Wrap}
                    />
                </div>
                <div className={styles.requests__Wrap}>
                    {
                        invoiceRequestsLoading ?
                            <LoadingSpinner 
                                width={'1.5rem'}
                                height={'1.5rem'}
                            />
                        :
                        !selectedUser ? <p className={styles.no__User}>
                            Please select a user to see their invoice requests
                        </p>
                        :
                        <>
                            <div className={styles.table__Wrap}>
                                <table className={styles.table__Item}>
                                    <thead>
                                        <tr>
                                            <td>User</td>
                                            <td>Payment from</td>
                                            <td>Payment to</td>
                                            <td>Month</td>
                                            <td>Year</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            React.Children.toArray(requestsForSelectedUser.map(request => {
                                                return <tr>
                                                    <td>{availableUsers?.find(user => user?._id === selectedUser)?.applicant}</td>
                                                    <td>{new Date(request.payment_from).toDateString()}</td>
                                                    <td>{new Date(request.payment_to).toDateString()}</td>
                                                    <td>{request?.payment_month}</td>
                                                    <td>{request?.payment_year}</td>
                                                </tr>
                                            }))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </>
                    }
                </div>
            </div>
        </StaffJobLandingLayout>
        
        {
            showNewRequestModal && <Overlay>
                <div className={styles.new__Request__Modal}>
                    <h3>
                        <span>
                            {
                                isSmallScreen ? 'Create new' 
                                :
                                'Create new invoice request'
                            }
                        </span>

                        <div 
                            className={styles.close}
                            onClick={
                                newInvoiceRequestLoading ? 
                                    () => {}
                                :
                                () => handleCloseRequestModal()
                            }
                        >
                            <AiOutlineClose />
                        </div>
                    </h3>
                    <label>
                        <span>Select user</span>
                        <Select 
                            value={
                                selectedUserForNewRequest ?
                                    {
                                        label: availableUsers?.find(user => user?._id === selectedUserForNewRequest)?.applicant,
                                        value: selectedUserForNewRequest,
                                    }
                                :
                                null
                            }
                            onChange={(val) => {
                                setSelectedUserForNewRequest(val.value);
                                
                                const foundUser = availableUsers.find(user => user._id === val.value);
                                if (!foundUser) return;

                                handleUpdateNewInvoiceRequest('username', foundUser?.username);
                                handleUpdateNewInvoiceRequest('portfolio_name', foundUser?.portfolio_name);
                                handleUpdateNewInvoiceRequest('user_id', foundUser?.user_id);
                            }}
                            options={
                                availableUsers.map(user => {
                                    return {
                                        label: user?.applicant,
                                        value: user?._id,
                                    }
                                })
                            }
                            className={styles.select__Wrap}
                        />
                    </label>
                    <div className={styles.date__Select}>
                        <span>Select dates</span>
                        <div className={styles.label__Wrap}>
                            <label>
                                <span>Payment from</span>
                                <input
                                    type="date"
                                    value={newInvoiceRequest.payment_from}
                                    onChange={handleFromDateChange}
                                    name="payment_from"
                                />
                            </label>
                            
                            <label>
                                <span>Payment to</span>
                                <input
                                    type="date"
                                    value={newInvoiceRequest.payment_to}
                                    onChange={handleToDateChange}
                                    name="payment_to"
                                />
                            </label>
                        </div>
                    </div>
                    <button
                        className={styles.submit__Btn}
                        disabled={newInvoiceRequestLoading}
                        onClick={() => handleCreateNewRequest()}
                    >
                        {
                            newInvoiceRequestLoading ?
                                <LoadingSpinner 
                                    width={'1.1rem'}
                                    height={'1.1rem'}
                                    color={'#fff'}
                                />
                            :
                            'Create'
                        }
                    </button>
                </div>
            </Overlay>
        }

    </>
}

export default AccountsInvoiceRequests;