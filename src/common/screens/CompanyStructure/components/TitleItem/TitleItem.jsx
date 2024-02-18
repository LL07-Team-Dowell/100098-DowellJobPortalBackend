import styles from "./styles.module.css";

export default function TitleItem ({ title, hasTrailingDash, hasLeadingDash }) {
    return <>
        {
            hasLeadingDash && <div className={styles.dash__Wrap}>
                <div className={styles.lead__dash}></div>
            </div>
        }
        <div className={styles.title__Item__Wrap}>
            <p>{title}</p>
        </div>
        {
            hasTrailingDash && <div className={styles.dash__Wrap}>
                <div className={styles.trail__dash}></div>
            </div>
        }
    </>
}