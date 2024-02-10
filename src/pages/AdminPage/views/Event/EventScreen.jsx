import React, { useState, useReducer } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { PageUnderConstruction } from "../../../UnderConstructionPage/ConstructionPage";
import styles from "./styles.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useJobContext } from "../../../../contexts/Jobs";
import { useEffect } from "react";
import { getAllEvents } from "../../../../services/hrServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { HiOutlineDotsVertical } from "react-icons/hi";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import EventsPopup from "./EventsPopUp";
import DeleteConfirmation from "../../../../components/DeleteConfirmation/DeleteConfirmation";
import { deleteEvents } from "../../../../services/eventServices";
import { toast } from "react-toastify";

const EventScreen = () => {
  const [showEventsPop, setShowEventsPop] = useState(false);
  const [showDeletePop, setShowDeletePop] = useState(false);
  const { projectsLoading } = useJobContext();
  const { currentUser } = useCurrentUserContext();
  const [events, setEvents] = useState([]);
  const [showEditOptions, setShowEditOptions] = useState({});
  const [showDeleteOptions, setShowDeleteOptions] = useState({});
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsBeingEdited, setEventsBeingEdited] = useState({});
  const [eventsBeingDeleted, setEventsBeingDeleted] = useState(null);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  useEffect(() => {
    if (eventsLoaded) return;

    getAllEvents({
      company_id: currentUser.portfolio_info[0].org_id,
      data_type: currentUser.portfolio_info[0].data_type,
    })
      .then((res) => {
        console.log(res.data.data);
        const eventDetails = res?.data?.data;
        const sortedEvents = eventDetails.reverse();
        setEvents(sortedEvents);
        setEventsLoading(false);
        setEventsLoaded(true);
        console.log(events);
      })
      .catch((err) => {
        console.log(err);
        setEventsLoading(false);
      });
  }, []);

  const showEventsPopup = () => {
    setShowEventsPop(true);
  };

  const handleUpdateEvent = (eventss) => {
    setEventsBeingEdited(eventss);
    setShowEventsPop(true);
    setShowEditOptions(false);
  };
  const handleDeleteEvent = (eventss) => {
    setEventsBeingDeleted(eventss);
    setShowDeletePop(true);
    setShowDeleteOptions(false);
  };

  const showIcon = (eventssId) => {
    setShowEditOptions((prevEditOption) => ({
      ...prevEditOption,
      [eventssId]: true,
    }));
  };

  const handleCloseModal = () => {
    setShowEventsPop(false);
    setShowDeletePop(false);
    setEventsBeingEdited(null);
  };

  const handleDeleteOfEvent = () => {
    if (eventsBeingDeleted) {
      const copyOfEvents = events.slice();

      deleteEvents(eventsBeingDeleted?._id);

      setEvents(
        copyOfEvents.filter((event) => event._id !== eventsBeingDeleted?._id)
      );

      handleCloseModal();

      setShowDeleteOptions(false);

      toast.success(`${eventsBeingDeleted.event_name} successfully deleted`);

      return;
    }
  };

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Events"}
      newSidebarDesign={true}
    >
      <div className={styles.wrapper_event}>
        <section className={styles.top__Nav__Content__edit}>
          <h2>Events</h2>
          <button
            onClick={projectsLoading ? () => {} : () => showEventsPopup()}
          >
            <AiOutlinePlus />
            <span>Add</span>
          </button>
        </section>
        {eventsLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={styles.event_cards}>
            {React.Children.toArray(
              events.map((eventss) => {
                return (
                  <div className={styles.event_card}>
                    <div className={styles.event_card_header}>
                      <h2>{eventss.event_name}</h2>
                      <div
                        className={styles.edit__App}
                        onClick={() => showIcon(eventss._id)}
                      >
                        <HiOutlineDotsVertical />
                      </div>
                    </div>
                    <div className={styles.event_card_description}>
                      <h3>Host: {eventss.event_host}</h3>
                      {eventss.project ? (
                        <h3>Project: {eventss.project}</h3>
                      ) : (
                        <></>
                      )}
                    </div>
                    {showEditOptions[eventss._id] && (
                      <ul className={styles.update__Listing_event}>
                        <li
                          className={styles.item}
                          onClick={() => handleUpdateEvent(eventss)}
                        >
                          Edit
                        </li>
                        <li
                          className={styles.delete}
                          onClick={() => handleDeleteEvent(eventss)}
                        >
                          Delete
                        </li>
                      </ul>
                    )}
                  </div>
                );
              })
            )}
            {showEventsPop && (
              <EventsPopup
                handleCloseModal={handleCloseModal}
                events={events}
                currentEvent={eventsBeingEdited}
                setCurrentEvent={setEventsBeingEdited}
                updateEvent={setEvents}
              />
            )}
            {showDeletePop && (
              <DeleteConfirmation
                text="Are you sure you want to delete this Event?"
                closeModal={handleCloseModal}
                deleteFunction={handleDeleteOfEvent}
              />
            )}
          </div>
        )}
      </div>
    </StaffJobLandingLayout>
  );
};
export default EventScreen;
