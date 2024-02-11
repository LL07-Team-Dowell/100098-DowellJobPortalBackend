import React, { useState, useEffect } from 'react'
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout'
import styles from './style.module.css';
import Select from 'react-select';
import { getAppliedJobs, getPaymentRecord, savePaymentRecord, updatePaymentRecord } from '../../../../services/candidateServices';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import { PiNotePencilDuotone, PiSealWarningDuotone } from "react-icons/pi";
import { IoAddCircleOutline, IoCloseSharp } from "react-icons/io5";
import Overlay from '../../../../components/Overlay';
import CreatableSelect from 'react-select/creatable';
import { Toast, toast } from 'react-toastify';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

const Payment = () => {
  const { currentUser } = useCurrentUserContext();
  const currencyList = [
    { label: "US Dollar (USD)", value: "USD" },
    { label: "Nigerian Naira (NGN)", value: "NGN" },
    { label: "British Pound (GBP)", value: "GBP" },
    { label: "Indian Rupee (INR)", value: "INR" }
  ];
  const paymentMethods = [
    { label: 'Upwork', value: 'Upwork' },
    { label: 'Fiverr', value: 'Fiverr' },
    { label: 'Truelancer', value: 'Truelancer' },
    { label: 'Wise', value: 'Wise' },
    { label: 'Paypal', value: 'Paypal' },
    { label: 'Payoneer', value: 'Payoneer' }
  ];
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [addEditModal, setAddEditModal] = useState(false);
  const [noDataFoundModal, setNoDatafoundModal] = useState(false);
  const [weeklyPay, setWeeklyPay] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentRecord, setPaymentRecord] = useState([]);
  const [userNotFound, setUserNotFound] = useState([]);
  const [addSingleUserRecord, setAddSingleUserRecord] = useState(false);
  const [Loading, setLoading] = useState({
    isLoading: false,
    isAddRecordLoading: false,
    isUpdateRecordLoading: false,
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    getAppliedJobs(currentUser?.portfolio_info[0].org_id).then(res => {
      const data = res?.data?.response?.data;
      const filteredUsers = data.map(
        users => ({
          label: users.applicant,
          value: users._id,
        }));
      setAllUsers(filteredUsers);
    }).catch(err => {
      console.log(err);
    })
  }, [])

  const handleGetRecordButtonClick = async () => {
    console.log(selectedUsers);
    if (selectedUsers.length === 0) {
      return toast.warn('Please select user(s)!');
    }
    setLoading({ ...Loading, isLoading: true });
    try {
      const promises = selectedUsers.map(async (user) => {
        const dataToPost = {
          "user_id": user.value,
          "company_id": currentUser?.portfolio_info[0]?.org_id
        };
        return getPaymentRecord(dataToPost);
      });

      const record = await Promise.all(promises);
      if (record.length > 0) {
        setPaymentRecord(record);
        toast.success('Payment record(s) retrieved successfully!');
      }
      setLoading({ ...Loading, isLoading: false });
    } catch (error) {
      setLoading({ ...Loading, isLoading: false });
      // console.error('Error occurred while fetching payment records:', error.response.data.response.message);
      toast.error('Unable to retrieve payment record(s)');
      const errorMessage = error?.response?.data?.response?.message;
      const collectionIdPattern = /'([^']+)'/;
      const match = collectionIdPattern.exec(errorMessage);
      console.log(match[1]);

      settingUserForUpdatingRecord(match[1]);
      setNoDatafoundModal(true);
    }
  }

  const settingUserForUpdatingRecord = (id) => {
    selectedUsers.forEach(user => {
      if (user.value === id) {
        setUserNotFound({ value: user.value, label: user.label });
      }
    });
  }

  const clearAllFields = () => {
    setWeeklyPay('');
    setSelectedCurrency([]);
    setSelectedUsers([]);
    setSelectedCurrency([]);
  }

  const closeModal = () => {
    clearAllFields();
    setPaymentMethod('');
    setAddEditModal(false);
  }

  const closeUpdateModal = () => {
    clearAllFields();
    setPaymentRecord([]);
    setShowUpdateModal(false);
  }

  const closeNoDataFoundModal = () => {
    setNoDatafoundModal(false);
  }

  const visibilityOfModals = () => {
    setNoDatafoundModal(false);
    setAddEditModal(true);
  }

  const handleAddRecordClick = () => {
    setSelectedUsers([]);
    visibilityOfModals();
    setPaymentRecord([]);
    setAddSingleUserRecord(false);
  }

  const handleNoDataFoundAddRecordClick = () => {
    setAddSingleUserRecord(true);
    visibilityOfModals();
  }

  const handleUserChange = (selectedUser) => {
    setSelectedUsers(selectedUser);
    selectedUser.length > 0 ? <></> : setPaymentRecord([]);
  }

  const handleCurrencyChange = selectedOption => setSelectedCurrency(selectedOption);
  const handlePaymentChange = selectedOption => setPaymentMethod(selectedOption);

  const handleAddRecordButtonClick = async () => {
    // !selectedUsers || !weeklyPay || !selectedCurrency || !paymentMethod
    if (!selectedUsers || !weeklyPay || !selectedCurrency || !paymentMethod) {
      return toast.error('Please select User(s), Weekly Pay, Currency and Payment method!');
    }
    setLoading({ ...Loading, isAddRecordLoading: true })
    if (addSingleUserRecord) {
      const dataToPost = {
        "company_id": currentUser?.portfolio_info[0]?.org_id,
        "user_id": userNotFound.value,
        "weekly_payment_amount": weeklyPay,
        "currency": selectedCurrency.value
      }

      await savePaymentRecord(dataToPost).then(() => {
        toast.success(`Payment record added successfully!`);
        setAddEditModal(false);
      }).catch(() => {
        toast.error('Unable to add payment record. Please try again!')
      })
      setLoading({ ...Loading, isAddRecordLoading: false })
    } else {
      try {
        const promises = selectedUsers.map(async (user) => {
          const dataToPost = {
            "company_id": currentUser?.portfolio_info[0]?.org_id,
            "user_id": user.value,
            "weekly_payment_amount": weeklyPay,
            "currency": selectedCurrency.value
          };
          return savePaymentRecord(dataToPost);
        });

        const results = await Promise.all(promises);

        if (results.length > 0) {
          toast.success(`Payment record(s) added successfully!`);
          setAddEditModal(false);
        } else {
          toast.error('Unable to add payment record(s). Please try again!');
        }
        // toast.success(`Payment record(s) added successfully!`);
      } catch (error) {
        toast.error('Unable to add payment record(s). Please try again!')
      }
      setLoading({ ...Loading, isAddRecordLoading: false })
    }
    clearAllFields();
  }

  const handleEditClick = (index) => {
    setShowUpdateModal(true);
    settingUserForUpdatingRecord(paymentRecord[index].data.data.user_id);
    setWeeklyPay(paymentRecord[index].data.data.weekly_payment_amount);
    setSelectedCurrency({ label: paymentRecord[index].data.data.payment_currency, value: paymentRecord[index].data.data.payment_currency })
  }

  const handleUpdateRecordButtonClick = async () => {
    // console.log(userNotFound.value, userNotFound.label, weeklyPay, selectedCurrency.value);
    setLoading({ ...Loading, isUpdateRecordLoading: true });
    const dataToPost = {
      "company_id": currentUser?.portfolio_info[0]?.org_id,
      "username": userNotFound.value,
      "weekly_payment_amount": weeklyPay,
      "currency": selectedCurrency.value,
    }

    await updatePaymentRecord(dataToPost).then(() => {
      toast.success('Record Updated Successfully!');
      setShowUpdateModal(false);
      setSelectedUsers([]);
      setPaymentRecord([]);
    }).catch(() => {
      toast.error('Unable to Update Record. Please try again!');
    })
    setLoading({ ...Loading, isUpdateRecordLoading: false });
    clearAllFields();
  }

  return (
    <StaffJobLandingLayout
      accountView={true}
      hideSearchBar={true}
    >
      <div className={styles.main_wrap}>
        <h3>Payment Records</h3>
        <div className={styles.selection_wrap}>
          <div className={styles.select_user}>
            <p>Select User:</p>
            {
              (addEditModal || showUpdateModal) ?
                <Select
                  isDisabled={true}
                /> :
                <Select
                  options={allUsers}
                  isMulti={true}
                  value={selectedUsers}
                  onChange={handleUserChange}
                />
            }
          </div>
          <button className={styles.btn_get_record} onClick={handleGetRecordButtonClick}>
            {
              Loading.isLoading ?
                <LoadingSpinner
                  width={"1.2rem"}
                  height={"1.2rem"} /> :
                'Get Record'
            }
          </button>
        </div>
        <div className={styles.record_table}>
          <table className={styles.table_list}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Weekly Pay</th>
                <th>Currency</th>
                <th>Previous Weekly Pays</th>
                <th>Last Payment date</th>
              </tr>
            </thead>
            <tbody>
              {
                paymentRecord.map((record, index) => (
                  <tr key={index}>
                    <td>
                      {selectedUsers.find(user => user.value === record?.data?.data?.user_id)?.label || ''}
                    </td>
                    <td>{record?.data?.data?.weekly_payment_amount}</td>
                    <td>{record?.data?.data?.payment_currency}</td>
                    <td>
                      {record?.data?.data?.previous_weekly_amounts && record.data.data.previous_weekly_amounts.length > 0 ? record.data.data.previous_weekly_amounts.join(', ') : '-'}
                    </td>
                    <td>{record?.data?.data?.last_payment_date !== "" ? record.data.data.last_payment_date : '-'}</td>
                    <td><PiNotePencilDuotone color="#005734" fontSize="1.5em" onClick={() => handleEditClick(index)} /></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className={styles.add_record} onClick={handleAddRecordClick}>
          <IoAddCircleOutline color="#005734" fontSize="2em" />
          <h6>Add Record</h6>
        </div>
        {
          addEditModal &&
          <Overlay>
            <div className={styles.add_edit_modal}>
              <div className={styles.close_icon}>
                <IoCloseSharp fontSize="1.5em" onClick={closeModal} />
              </div>
              <div className={styles.edit_add_record}>
                <div className={styles.select_input}>
                  {
                    addSingleUserRecord ?
                      <>
                        <p>User:</p>
                        <Select
                          isMulti={false}
                          defaultValue={userNotFound}
                          isDisabled={true}
                          placeholder="Select User(s)..."
                        />
                      </>
                      :
                      <>
                        <p>Select User(s):</p>
                        <Select
                          options={allUsers}
                          isMulti={true}
                          value={selectedUsers}
                          onChange={handleUserChange}
                          placeholder="Select User(s)..."
                        />
                      </>
                  }
                </div>
                <div className={styles.select_input}>
                  <p>Weekly Pay:</p>
                  <input type='text'
                    value={weeklyPay}
                    onChange={(e) => setWeeklyPay(e.target.value)}
                  />
                </div>
                <div className={styles.select_input}>
                  <p>Payment Currency:</p>
                  <Select
                    options={currencyList}
                    isMulti={false}
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    placeholder="Select a currency..."
                  />
                </div>
                <div className={styles.select_input}>
                  <p>Payment Method:</p>
                  <Select
                    options={paymentMethods}
                    isMulti={false}
                    value={paymentMethod}
                    onChange={handlePaymentChange}
                    placeholder="Select a payment method..."
                  />
                </div>
                <button className={`${styles.btn_get_record} ${styles.btn_add_record}`} onClick={handleAddRecordButtonClick}>
                  {
                    Loading.isAddRecordLoading ?
                      <LoadingSpinner
                        width={"1.5rem"}
                        height={"1.5rem"} /> :
                      'Add'
                  }
                </button>
              </div>
            </div>
          </Overlay>
        }
        {
          showUpdateModal &&
          <Overlay>
            <div className={styles.add_edit_modal}>
              <div className={styles.close_icon}>
                <IoCloseSharp fontSize="1.5em" onClick={closeUpdateModal} />
              </div>
              <div className={styles.edit_add_record}>
                <div className={styles.select_input}>
                  <p>User:</p>
                  <Select
                    isMulti={false}
                    defaultValue={userNotFound}
                    isDisabled={true}
                    placeholder="Select User(s)..."
                  />

                </div>
                <div className={styles.select_input}>
                  <p>Weekly Pay:</p>
                  <input type='text'
                    value={weeklyPay}
                    onChange={(e) => setWeeklyPay(e.target.value)}
                  />
                </div>
                <div className={styles.select_input}>
                  <p>Payment Currency:</p>
                  <Select
                    options={currencyList}
                    isMulti={false}
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    placeholder="Select a currency..."
                  />
                </div>
                <button className={`${styles.btn_get_record} ${styles.btn_add_record}`} onClick={handleUpdateRecordButtonClick}>
                  {
                    Loading.isUpdateRecordLoading ?
                      <LoadingSpinner
                        width={"1.5rem"}
                        height={"1.5rem"} /> :
                      'Update'
                  }
                </button>
              </div>
            </div>
          </Overlay>
        }
        {
          noDataFoundModal &&
          <Overlay>
            <div className={styles.no_data_found_modal}>
              <div className={styles.close_icon}>
                <IoCloseSharp fontSize="1.5em" onClick={closeNoDataFoundModal} />
              </div>
              <div className={styles.warning_modal}>
                <PiSealWarningDuotone fontSize='8em' color='#ac1616' />
                <b>No Payment Record Found!</b>
                <p><p className={styles.user_not_found}>{userNotFound.label}</p> does not have any record</p>
                <div className={styles.add_record} onClick={handleNoDataFoundAddRecordClick}>
                  <IoAddCircleOutline color="#005734" fontSize="2em" />
                  <h6>Add Record</h6>
                </div>
              </div>
            </div>
          </Overlay>
        }
      </div>
    </StaffJobLandingLayout>
  )
}

export default Payment;


{/* <CreatableSelect
                    components={components}
                    inputValue={inputValue}
                    isClearable
                    isMulti={false}
                    menuIsOpen={false}
                    onChange={(newValue) => setValue(newValue)}
                    onInputChange={(newValue) => setInputValue(newValue)}
                    // onKeyDown={handleKeyDown}
                    placeholder="Type something and press enter..."
                    value={value}
                  /> */}

//     <tr>
//   <td>ayesha</td>
//   <td>35</td>
//   <td>USD</td>
//   <td>35</td>
//   <td>january</td>
//   <td><PiNotePencilDuotone color="#005734" fontSize="1.5em" /></td>
// </tr>