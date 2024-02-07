import React, { useState, useReducer } from "react";
import Overlay from "../../../../components/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./styles.module.css";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useJobContext } from "../../../../contexts/Jobs";
import { addEvents, updateEvents } from "../../../../services/eventServices";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import Select from "react-select";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";

const EventsPopup = ({
  handleCloseModal,
  setShowEventsPop,
  forceUpdateEvent,
  id,
}) => {
  const { currentUser } = useCurrentUserContext();
  const { applications } = useJobContext();
  const [eventFrequency, setEventFrequency] = useState("");
  const [eventType, setEventType] = useState("");
  const [dataPosting, setDataPosting] = useState(false);
  const [selectedEventHost, setSelectedEventHost] = useState(null);
  console.log(id);

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

  const handleUpdate = () => {
    setDataPosting(true);
    const fetchEventDetails = async () => {
      let newDocumentId;

      try {
        if (id && id !== null) {
          const editEventDetails = await updateEvents(editEvent);

          console.log(editEventDetails);
          setEditEvent((prevDetails) => {
            return {
              ...prevDetails,
              event_name: editEvent.event_name,
              event_host: editEvent.event_host,
              event_frequency: editEvent.event_frequency,
              document_id: id,
              company_id: currentUser.portfolio_info[0].org_id,
            };
          });
          console.log(editEvent);

          toast.success("Events successfully updated");
        } else {
          const eventDetails = (await addEvents(editEvent)).data;
          console.log(eventDetails);

          newDocumentId = eventDetails?.data?.inserted_id;
          setEditEvent((prevDetails) => {
            return { ...prevDetails, ...editEvent };
          });
          setShowEventsPop();
          toast.success("Events successfully added");
          forceUpdateEvent();
        }

        if (newDocumentId) {
          window.history.replaceState(
            {},
            document.title,
            `/100098-DowellJobPortal/#/event/?id=${encodeURIComponent(
              newDocumentId
            )}`
          );
        }
      } catch (error) {
        console.log(console.error("Error fetching project details:", error));
        toast.error("Something went wrong");
      }
    };

    setDataPosting(false);

    fetchEventDetails();
  };

  return (
    <>
      <Overlay>
        <div className={styles.edit_modal_event}>
          <div style={{ width: "100%" }}>
            <AiOutlineClose
              onClick={handleCloseModal}
              className={styles.edit_Icon_event}
            />
          </div>
          {id ? (
            <>
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
            </>
          ) : (
            <>
              <div className={styles.events_popup}>
                <h2>Add New Event</h2>
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
            </>
          )}

          <div className="project__btn">
            <button
              className={styles.project__submit}
              onClick={handleUpdate}
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
      </Overlay>
    </>
  );
};

export default EventsPopup;
