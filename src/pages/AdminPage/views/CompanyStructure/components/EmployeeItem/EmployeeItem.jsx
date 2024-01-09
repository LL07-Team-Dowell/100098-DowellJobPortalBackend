import Avatar from "react-avatar";
import styles from "./styles.module.css";


export default function EmployeeItem ({ item, isImageItem }) {
    return <>
        <div>
            {
                isImageItem ? 
                    <Avatar
                        name={
                            item?.applicant.slice(0, 1) +
                            " " +
                            item?.applicant
                            .split(" ")
                            [item?.applicant.split(" ").length - 1]?.slice(0, 1)
                        }
                        round={true}
                        size='3rem'
                    />
                :
                <p className={styles.item__Wrap}>{item}</p>
            }
        </div>
    </>
}