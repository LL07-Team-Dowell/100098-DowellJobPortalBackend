import React from "react";

const Card = ({
  username,
  update_task_date,
  project,
  update_reason,
  updateTask,
}) => {
  return (
    <div>
      <h2>{project}</h2>
      <p>Request Data:{formatDate(update_task_date)}</p>
      <p>{update_reason}</p>
      {updateTask && <button>Update Task</button>}
    </div>
  );
};

export default Card;
function formatDate(inputDate) {
  const [day, month, year] = inputDate.split("/").map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return "Invalid date format";
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const inputFullYear = year < 100 ? year + 2000 : year;

  const date = new Date(inputFullYear, month - 1, day);
  const dayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][date.getUTCDay()];

  const formattedDate = `${dayName}, ${day} ${
    months[month - 1]
  } ${inputFullYear}`;
  return formattedDate;
}
