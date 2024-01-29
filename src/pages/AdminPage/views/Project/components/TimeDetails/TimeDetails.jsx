import React from "react";
import styles from "./styles.module.css";

export default function TimeDetails({
  title,
  time,
  isSubproject,
  subprojects,
}) {
  if (isSubproject && Array.isArray(subprojects))
    return (
      <div className={styles.time__Detail}>
        <h3>{title}</h3>
        <ul className={styles.listing}>
          {React.Children.toArray(
            subprojects.map((subproject) => {
              return <li>{subproject}</li>;
            })
          )}
        </ul>
      </div>
    );

  return (
    <div className={styles.time__Detail}>
      <h3>{title}</h3>
      <div>
        <p className={styles.hour__Info}>
          {Number(time).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </p>
        <p className={styles.hour__Label}>hours</p>
      </div>
    </div>
  );
}
