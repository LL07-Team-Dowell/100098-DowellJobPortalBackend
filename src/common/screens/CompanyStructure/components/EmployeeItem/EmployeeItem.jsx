import Avatar from "react-avatar";
import styles from "./styles.module.css";


export default function EmployeeItem ({ item, isImageItem, isNotEmployeeItem }) {
    return <>
        <div>
            {
                isImageItem ? 
                    <Avatar
                        name={
                            isNotEmployeeItem ?
                                item
                            :
                            item?.applicant
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