import React, { useState, useEffect } from 'react'
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout'
import styles from './style.module.css';
import Select from 'react-select';
import { getPaymentRecord, savePaymentRecord, updatePaymentRecord } from '../../../../services/candidateServices';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import { PiNotePencilDuotone, PiSealWarningDuotone } from "react-icons/pi";
import { IoAddCircleOutline, IoCloseSharp } from "react-icons/io5";
import Overlay from '../../../../components/Overlay';
// import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { managementUpdateProject } from '../../../../services/accountServices';

const Payment = () => {
  const navigate = useNavigate();
  const { 
    currentUser,
    allCompanyApplications,
    userRemovalStatusChecked,
  } = useCurrentUserContext();
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
    displayingUpdateRecord: false,
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [weeklyPayList, setWeeklyPayList] = useState([]);
  const [usersOtherInfo, setUsersOtherInfo] = useState([]);

  useEffect(() => {
    if (!userRemovalStatusChecked) return;

    const filteredUsers = allCompanyApplications
      .filter(users => users.hasOwnProperty('user_id'))
      .map(users => ({
        label: users.applicant,
        value: users.user_id,
      }));
    setAllUsers(filteredUsers);

    const filteredOtherInfo = allCompanyApplications
      .filter(users => users.hasOwnProperty('user_id'))
      .map(users => ({
        user_id: users.user_id,
        // name: users.applicant,
        freelancePlatform: users.freelancePlatform,
        payment: users.payment,
        project: users.project,
      }));
    setUsersOtherInfo(filteredOtherInfo);
  }, [userRemovalStatusChecked])

  const handleGetRecordButtonClick = async () => {
    console.log(selectedUsers);
    if (selectedUsers.length === 0) {
      return toast.warn('Please select user(s)!');
    }
    setLoading({ ...Loading, isLoading: true });

    try {
      const promises = selectedUsers.map(async (user) => {
        return getPaymentRecord(user.value);
      });

      const record = await Promise.all(promises);
      console.log('record>>>>>>>', record);
      if (record.length > 0) {
        setPaymentRecord(record);

        const userIDs = record
          .filter(data => data && data.data && data.data.response && data.data.response.user_id)
          .map(data => data.data.response.user_id);

        const firstUnmatchedUser = selectedUsers.find(user => !userIDs.some(id => id === user.value));

        if (firstUnmatchedUser) {
          settingUserForUpdatingRecord(firstUnmatchedUser.value);
          setNoDatafoundModal(true);
        }
        toast.success('Payment record(s) retrieved successfully!');
      }
      setLoading({ ...Loading, isLoading: false, displayingUpdateRecord: false });
    } catch (error) {
      setLoading({ ...Loading, isLoading: false });
      console.error('Error occurred while fetching payment records:', error.response.data.message);
      toast.error('Unable to retrieve payment record(s)');
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
    setPaymentMethod([]);
    setWeeklyPayList([]);
  }

  const closeModal = () => {
    clearAllFields();
    setPaymentMethod('');
    setWeeklyPayList([]);
    setAddEditModal(false);
  }

  const closeUpdateModal = () => {
    // clearAllFields();
    // setPaymentRecord([]);
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
    clearAllFields();
    visibilityOfModals();
    setPaymentRecord([]);
    setAddSingleUserRecord(false);
  }

  const handleNoDataFoundAddRecordClick = () => {
    setWeeklyPay('');
    setSelectedCurrency([]);
    setPaymentMethod([]);
    setSelectedCurrency([]);
    setAddSingleUserRecord(true);
    visibilityOfModals();
  }

  const handleUserChange = (selectedUser) => {
    console.log(selectedUser);
    setSelectedUsers(selectedUser);
    selectedUser.length > 0 ? <></> : setPaymentRecord([]);
  }

  const getCurrencyFromPayment = (paymentString) => {
    if (paymentString.includes('$')) {
      return { label: "US Dollar (USD)", value: "USD" };
    }
    if (paymentString.includes('₦')) {
      return { label: "Nigerian Naira (NGN)", value: "NGN" };
    }
    if (paymentString.includes('£')) {
      return { label: "British Pound (GBP)", value: "GBP" };
    }
    if (paymentString.includes('₹')) {
      return { label: "Indian Rupee (INR)", value: "INR" };
    }

    const currency = currencyList.find(currency => paymentString.toUpperCase().includes(currency.value.toUpperCase()));
    // console.log('currency>>>>>>>>>', currency);
    return currency ? currency : 'Unknown Currency';
  };

  const handleAddUserChange = (selectedUser) => {
    setSelectedUsers(selectedUser);

    if (selectedUser.length === 0) {
      setWeeklyPayList([]);
      setSelectedCurrency([]);
      setPaymentMethod([]);
      return;
    }

    const updatedList = [];
    const updatedCurrencyList = [];
    const updatedPaymentMethodList = [];

    selectedUser.forEach(user => {
      const userInfo = usersOtherInfo.find(info => info.user_id === user.value);
      if (userInfo) {

        const paymentValue = userInfo.payment.match(/\d+(\.\d+)?/);
        const label = paymentValue ? paymentValue[0] : '30';
        updatedList.push({ label, value: userInfo.user_id });

        const currency = getCurrencyFromPayment(userInfo.payment);
        updatedCurrencyList.push((!currency || currency.length < 1 || currency === 'Unknown Currency') ? 
          {
            label: "US Dollar (USD)", 
            value: "USD"
          } 
          : 
          { 
            label: currency.label, 
            value: currency.value 
          }
        );

        updatedPaymentMethodList.push({ label: userInfo.freelancePlatform, value: userInfo.user_id });
      }
    });

    setWeeklyPayList(updatedList);
    setSelectedCurrency(updatedCurrencyList);
    setPaymentMethod(updatedPaymentMethodList);
  };


  const handleCurrencyChange = selectedOption => setSelectedCurrency(selectedOption);
  const handlePaymentChange = selectedOption => setPaymentMethod(selectedOption);

  const handleAddRecordButtonClick = async () => {
    // !selectedUsers || !weeklyPay || !selectedCurrency || !paymentMethod
    if (!selectedUsers || !weeklyPayList || !selectedCurrency || !paymentMethod) {
      return toast.error('Please select User(s), Weekly Pay, Currency and Payment method!');
    }
    // clearAllFields();
    setLoading({ ...Loading, isAddRecordLoading: true })
    if (addSingleUserRecord) {
      const dataToPost = {
        "company_id": currentUser?.portfolio_info[0]?.org_id,
        "user_id": userNotFound.value,
        "weekly_payment_amount": weeklyPay,
        "currency": selectedCurrency.value,
        "payment_method": paymentMethod.label,
      }

      console.log(dataToPost);
      await savePaymentRecord(dataToPost).then(() => {
        toast.success(`Payment record added successfully!`);
        setAddEditModal(false);
        handleGetRecordButtonClick();
      }).catch(error => {
        toast.error(`${error.response.data.message}, Please update the record!`);
      })
      setLoading({ ...Loading, isAddRecordLoading: false, displayingUpdateRecord: true })
    } else {
      try {
        const promises = selectedUsers.map((user, index) => {
          const weeklyPayEntry = weeklyPayList.find(entry => entry.value === user.value);
          const paymentMethodEntry = paymentMethod.find(entry => entry.value === user.value);

          // console.log(paymentMethodEntry.label);
          const currencyEntry = selectedCurrency[index];

          const dataToPost = {
            "company_id": currentUser?.portfolio_info[0]?.org_id,
            "user_id": user.value,
            "weekly_payment_amount": weeklyPayEntry ? weeklyPayEntry.label : null,
            "currency": currencyEntry.value,
            "payment_method": paymentMethodEntry.label,
          };
          // return dataToPost;
          return savePaymentRecord(dataToPost);
        });
        console.log(promises);

        const results = await Promise.all(promises);

        if (results.length > 0) {
          toast.success(`Payment record(s) added successfully!`);
          setAddEditModal(false);
        } else {
          toast.error('Unable to add payment record(s). Please try again!');
        }
        toast.success(`Payment record(s) added successfully!`);
      } catch (error) {
        // console.log(error.response.data.message);
        toast.error(`${error.response.data.message}, Please update the record!`);
      }
      setLoading({ ...Loading, isAddRecordLoading: false })

    }
    // clearAllFields();
  }

  const handleEditClick = (index) => {
    setShowUpdateModal(true);
    settingUserForUpdatingRecord(paymentRecord[index].data.response.user_id);
    setWeeklyPay(paymentRecord[index].data.response.weekly_payment_amount);
    setSelectedCurrency({ label: paymentRecord[index].data.response.payment_currency, value: paymentRecord[index].data.response.payment_currency })
    setPaymentMethod({ label: paymentRecord[index].data.response.payment_method, value: paymentRecord[index].data.response.payment_method })
  }

  const handleUpdateRecordButtonClick = async () => {
    setLoading({ ...Loading, isUpdateRecordLoading: true });

    const dataToPostforUpdatingRecord = {
      "company_id": currentUser?.portfolio_info[0]?.org_id,
      "user_id": userNotFound.value,
      "weekly_payment_amount": weeklyPay,
      "currency": selectedCurrency.value,
      "payment_method": paymentMethod.label,
    }

    const projectOfSelectedUser = usersOtherInfo.find(user => user.user_id === userNotFound.value);
    const dataToPostForUpdatingProject = {
      "document id": userNotFound.value,
      "project": projectOfSelectedUser?.project,
      "payment": `${weeklyPay} ${selectedCurrency.value}`
    }

    const updateRecord = updatePaymentRecord(dataToPostforUpdatingRecord);
    const updateProject = managementUpdateProject(dataToPostForUpdatingProject);

    await Promise.all([updateRecord, updateProject])
      .then(() => {
        toast.success('Record Updated Successfully!');
        setShowUpdateModal(false);
        handleGetRecordButtonClick();
      })
      .catch(() => {
        toast.error('Unable to Update Record. Please try again!');
      });
    setLoading({ ...Loading, isUpdateRecordLoading: false, displayingUpdateRecord: true });
  }

  return (
    <StaffJobLandingLayout
      accountView={true}
      hideSearchBar={true}
    >
      <div className="att_title"><div className={styles.back_icon} onClick={() => navigate(-1)}><IoChevronBack /></div><h3>Payment Records</h3></div>
      <div className={styles.main_wrap}>
        {/* <h3>Payment Records</h3> */}
        <div className={styles.selection_wrap}>
          <div className={styles.select_user}>
            <p>Select User:</p>
            {
              (addEditModal || showUpdateModal) ?
                <Select
                  value={{ value: '', label: 'Select...' }}
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
                  height={"1.2rem"} 
                  color={'white'}
                /> :
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
                <th>Payment Method</th>
                <th>Last Payment date</th>
                <th></th>
              </tr>
            </thead>
            {
              Loading.displayingUpdateRecord ?
                <></>
                :
                <tbody>
                  {paymentRecord.map((record, index) => (
                    record?.data && !showUpdateModal ? (
                      selectedUsers.find(user => user.value === record?.data?.response?.user_id) ? (
                        <tr key={index}>
                          <td>
                            {selectedUsers.find(user => user.value === record?.data?.response?.user_id)?.label || ''}
                          </td>
                          <td>{record?.data?.response?.weekly_payment_amount}</td>
                          <td>{record?.data?.response?.payment_currency}</td>
                          <td>
                            {record?.data?.response?.previous_weekly_amounts && record?.data?.response?.previous_weekly_amounts.length > 0 ? record?.data?.response?.previous_weekly_amounts.join(', ') : '-'}
                          </td>
                          <td>{record?.data?.response?.payment_method}</td>
                          <td>
                            {record?.data?.response?.last_payment_date !== "" ? `${new Date(record?.data?.response?.last_payment_date).toDateString()}` : '-'}
                          </td>
                          <td className={styles.icon_edit}><PiNotePencilDuotone color="#005734" className={styles.edit_icon} onClick={() => handleEditClick(index)} /></td>
                        </tr>
                      ) : null
                    ) : null
                  ))}
                </tbody>
            }
          </table>
        </div>
        {
          Loading.displayingUpdateRecord ?
            <div className={styles.loader_}>
              {/* <p>Crunching updated data for you</p> */}
              <LoadingSpinner width={'3rem'} height={'3rem'} />
            </div>
            :
            <div className={styles.add_record} onClick={handleAddRecordClick}>
              <IoAddCircleOutline color="#005734" fontSize="2em" />
              <h6>Add New Record</h6>
            </div>
        }
        {
          addEditModal &&
          <Overlay>
            <div className={styles.add_edit_modal}>
              <div className={styles.close_icon}>
                <IoCloseSharp fontSize="1.5em" onClick={closeModal} cursor={'pointer'} />
              </div>
              <div className={styles.edit_add_record}>
                {
                  addSingleUserRecord ?
                    <>
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
                          placeholder='Enter weekly pay...'
                        />
                      </div>
                      <div className={styles.select_input}>
                        <p>Payment Currency:</p>
                        <Select
                          options={currencyList}
                          isMulti={false}
                          value={selectedCurrency}
                          onChange={handleCurrencyChange}
                          placeholder="Select currency..."
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
                    </>
                    :
                    <>
                      <div className={styles.record_info}>
                        <h3 className={styles.add_edit_heading}>Add new record</h3>
                        <p className={styles.add_edit_info}>Weekly pay, Currency and Payment Method can only be updated after record is created.</p>
                      </div>
                      <div className={styles.select_input}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <span>Select User(s):</span>
                          <label style={{ 
                            display: 'flex',
                            alignItems: 'center', 
                            gap: '0.2rem',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                          }}>
                            <input
                              type='checkbox'
                              onChange={({ target }) => {
                                if (target.checked === true) return handleAddUserChange(allUsers);
                                handleAddUserChange([]);
                              }}
                            ></input>
                            <span style={{ whiteSpace: 'nowrap' }}>Select all</span>
                          </label>
                        </p>
                        <Select
                          options={allUsers}
                          isMulti={true}
                          value={selectedUsers}
                          onChange={handleAddUserChange}
                          placeholder="Select User(s)..."
                        />

                      </div>
                      <div className={styles.select_input}>
                        <p className={styles.text_disabled}>Weekly Pay for user(s) selected:</p>
                        <Select
                          value={weeklyPayList}
                          isMulti={true}
                          isDisabled={true}
                          placeholder="Weekly Pay..."
                        />
                      </div>
                      <div className={styles.select_input}>
                        <p className={styles.text_disabled}>Payment Currency for user(s) selected:</p>
                        <Select
                          isMulti={true}
                          value={selectedCurrency}
                          isDisabled={true}
                          placeholder="Currency..."
                        />
                      </div>
                      <div className={styles.select_input}>
                        <p className={styles.text_disabled}>Payment Method for user(s) selected:</p>
                        <Select
                          isMulti={true}
                          value={paymentMethod}
                          isDisabled={true}
                          placeholder="Payment method..."
                        />
                      </div>
                    </>
                }
                <button className={`${styles.btn_get_record} ${styles.btn_add_record}`} onClick={handleAddRecordButtonClick}>
                  {
                    Loading.isAddRecordLoading ?
                      <LoadingSpinner
                        width={"1.5rem"}
                        height={"1.5rem"} 
                        color={'white'}
                      /> :
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
                <IoCloseSharp fontSize="1.5em" onClick={closeUpdateModal} cursor={'pointer'} />
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
                <IoCloseSharp fontSize="1.5em" onClick={closeNoDataFoundModal} cursor={'pointer'} />
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
