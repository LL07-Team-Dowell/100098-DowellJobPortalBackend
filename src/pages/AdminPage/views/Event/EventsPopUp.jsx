import React, { useState, useReducer, useEffect } from "react";
import Overlay from "../../../../components/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./styles.module.css";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useJobContext } from "../../../../contexts/Jobs";
import {
  addEvents,
  getAllEvents,
  updateEvents,
} from "../../../../services/eventServices";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import Select from "react-select";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";

const EventsPopup = ({
  handleCloseModal,
  currentEvent,
  events,
  updateEvent,
  setCurrentEvent,
}) => {
  const { currentUser } = useCurrentUserContext();
  const { applications } = useJobContext();
  const [eventFrequency, setEventFrequency] = useState("");
  const [eventType, setEventType] = useState("");
  const [dataPosting, setDataPosting] = useState(false);
  const [selectedEventHost, setSelectedEventHost] = useState(null);
  const [checkingHost, setCheckingHost] = useState([]);
  console.log(currentEvent);

  const [editEvent, setEditEvent] = useState({
    company_id: currentUser.portfolio_info[0].org_id,
    event_name: "",
    event_frequency: "",
    data_type: currentUser.portfolio_info[0].data_type,
    event_host: "",
    event_type: "",
    is_mendatory: true,
  });

  const onboardedApplicants = applications.filter(
    (application) => application.status === candidateStatuses.ONBOARDING
  );

  // console.log(onboardedApplicants);

  const handleChange = (valueEntered, inputName) => {
    setEditEvent((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = valueEntered;
      return copyOfPrevValue;
    });
  };

  const handleEditChange = (valueEntered, inputName) => {
    setCurrentEvent((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = valueEntered;
      return copyOfPrevValue;
    });
  };

  const handleEditUpdate = async () => {
    if (currentEvent) {
      const dataGottenBack = await updateEvents({
        ...editEvent,
        document_id: currentEvent?._id,
      });
      console.log(dataGottenBack);

      const copyOfEvents = events.slice();
      const foundEventsIdx = copyOfEvents.findIndex(
        (event) => event._id === currentEvent?._id
      );

      if (foundEventsIdx !== -1) {
        const foundEventsInState = copyOfEvents[foundEventsIdx];
        copyOfEvents[foundEventsIdx] = {
          ...foundEventsInState,
          ...editEvent,
        };
        updateEvent(copyOfEvents);
      }

      toast.success("Events Updated successfully");

      handleCloseModal();

      return;
    }
  };

  const handleAddUpdate = () => {
    const fetchEventDetails = async () => {
      const insertedId = await addEvents(editEvent);
      const newEvent = { ...editEvent, _id: insertedId };

      const copyOfEvents = events.slice();
      copyOfEvents.unshift(newEvent);
      updateEvent(copyOfEvents);

      toast.success("Events successfully added");

      handleCloseModal();
    };

    fetchEventDetails();
  };

  return (
    <>
      <Overlay>
        {currentEvent ? (
          <>
            <div className={styles.edit_modal_event}>
              <div style={{ width: "100%" }}>
                <AiOutlineClose
                  onClick={handleCloseModal}
                  className={styles.edit_Icon_event}
                />
              </div>
              <div className={styles.events_popup}>
                <h2>Edit Event</h2>
                <label htmlFor="event_name">
                  <span>Event Name</span>
                  <input
                    type="text"
                    className={styles.select_Item_event}
                    id="event_name"
                    name="event_name"
                    placeholder="Enter Event name"
                    value={currentEvent.event_name}
                    onChange={(e) =>
                      handleEditChange(e.target.value, e.target.name)
                    }
                  />
                </label>

                <label htmlFor="event_host">
                  <span>Event Host</span>
                  <Select
                    options={onboardedApplicants.map((applicant) => {
                      return {
                        label: applicant.applicant,
                        value: applicant.username,
                      };
                    })}
                    onChange={(selectedOption) => {
                      setCurrentEvent((prevValue) => ({
                        ...prevValue,
                        event_host: selectedOption.value,
                      }));
                      setSelectedEventHost(selectedOption);
                    }}
                    defaultValue={{
                      label: currentEvent.event_host,
                      value: currentEvent.event_host,
                    }}
                    className={styles.events__popup__select}
                  />
                </label>

                <label htmlFor="event_host">
                  <span>Event Frequency</span>
                  <Select
                    options={[
                      { label: "daily", value: "daily" },
                      { label: "weekly", value: "weekly" },
                      { label: "twice a week", value: "twice_a_week" },
                      { label: "monthly", value: "monthly" },
                      { label: "yearly", value: "yearly" },
                    ]}
                    onChange={(selectedOption) => {
                      setCurrentEvent((prevValue) => ({
                        ...prevValue,
                        event_frequency: selectedOption.value,
                      }));
                      setEventFrequency(selectedOption);
                    }}
                    defaultValue={{
                      label: currentEvent.event_frequency,
                      value: currentEvent.event_frequency,
                    }}
                    className={styles.events__popup__select}
                  />
                </label>

                <label htmlFor="event_type">
                  <span>Event Type</span>
                  <Select
                    options={[
                      { label: "Meeting", value: "Meeting" },
                      { label: "Event", value: "Event" },
                    ]}
                    onChange={(selectedOption) => {
                      setCurrentEvent((prevValue) => ({
                        ...prevValue,
                        event_type: selectedOption.value,
                      }));
                      setEventType(selectedOption);
                    }}
                    defaultValue={{
                      label: currentEvent.event_type,
                      value: currentEvent.event_type,
                    }}
                    className={styles.events__popup__select}
                  />
                </label>

                <div className={styles.event_mandatory}>
                  <label htmlFor="is_mendatory">Is Mandatory ?</label>
                  <div className={styles.edit_is_mandatory}>
                    <input
                      className={styles.edit_active_checkbox}
                      type="checkbox"
                      name={"is_mendatory"}
                      checked={currentEvent.is_mendatory}
                      onChange={(e) =>
                        handleEditChange(e.target.checked, e.target.name)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="project__btn">
                <button
                  className={styles.project__submit}
                  onClick={handleEditUpdate}
                  disabled={dataPosting ? true : false}
                >
                  {dataPosting ? (
                    <LoadingSpinner
                      width={"1.2rem"}
                      height={"1.2rem"}
                      color={"#fff"}
                    />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.edit_modal_event}>
              <div style={{ width: "100%" }}>
                <AiOutlineClose
                  onClick={handleCloseModal}
                  className={styles.edit_Icon_event}
                />
              </div>
              <div className={styles.events_popup}>
                <h2>Edit Event</h2>
                <label htmlFor="event_name">
                  <span>Event Name</span>
                  <input
                    type="text"
                    className={styles.select_Item_event}
                    id="event_name"
                    name="event_name"
                    placeholder="Enter Event name"
                    value={editEvent.event_name}
                    onChange={(e) =>
                      handleChange(e.target.value, e.target.name)
                    }
                  />
                </label>

                <label htmlFor="event_host">
                  <span>Event Host</span>
                  <Select
                    options={onboardedApplicants.map((applicant) => {
                      return {
                        label: applicant.applicant,
                        value: applicant.username,
                      };
                    })}
                    onChange={(selectedOption) => {
                      setEditEvent((prevValue) => ({
                        ...prevValue,
                        event_host: selectedOption.value,
                      }));
                      setSelectedEventHost(selectedOption);
                    }}
                    className={styles.events__popup__select}
                  />
                </label>

                <label htmlFor="event_host">
                  <span>Event Frequency</span>
                  <Select
                    options={[
                      { label: "daily", value: "daily" },
                      { label: "weekly", value: "weekly" },
                      { label: "twice a week", value: "twice_a_week" },
                      { label: "monthly", value: "monthly" },
                      { label: "yearly", value: "yearly" },
                    ]}
                    onChange={(selectedOption) => {
                      setEditEvent((prevValue) => ({
                        ...prevValue,
                        event_frequency: selectedOption.value,
                      }));
                      setEventFrequency(selectedOption);
                    }}
                    className={styles.events__popup__select}
                  />
                </label>

                <label htmlFor="event_type">
                  <span>Event Type</span>
                  <Select
                    options={[
                      { label: "Meeting", value: "Meeting" },
                      { label: "Event", value: "Event" },
                    ]}
                    onChange={(selectedOption) => {
                      setEditEvent((prevValue) => ({
                        ...prevValue,
                        event_type: selectedOption.value,
                      }));
                      setEventType(selectedOption);
                    }}
                    className={styles.events__popup__select}
                  />
                </label>

                <div className={styles.event_mandatory}>
                  <label htmlFor="is_mendatory">Is Mandatory ?</label>
                  <div className={styles.edit_is_mandatory}>
                    <input
                      className={styles.edit_active_checkbox}
                      type="checkbox"
                      name={"is_mendatory"}
                      checked={editEvent.is_mendatory}
                      onChange={(e) =>
                        handleChange(e.target.checked, e.target.name)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="project__btn">
                <button
                  className={styles.project__submit}
                  onClick={handleAddUpdate}
                  disabled={dataPosting ? true : false}
                >
                  {dataPosting ? (
                    <LoadingSpinner
                      width={"1.2rem"}
                      height={"1.2rem"}
                      color={"#fff"}
                    />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </Overlay>
    </>
  );
};

export default EventsPopup;
