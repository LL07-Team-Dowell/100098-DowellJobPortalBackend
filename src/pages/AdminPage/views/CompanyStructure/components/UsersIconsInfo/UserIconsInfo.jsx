import React from "react";
import EmployeeItem from "../EmployeeItem/EmployeeItem";
import styles from "./styles.module.css";

export default function UserIconsInfo ({ items }) {
    if (!items || !Array.isArray(items)) return <></>

    return <div className={styles.nav__Users__Content}>
        <>
            {
                React.Children.toArray(
                    items?.slice(0, 3)?.map(application => {
                        return <EmployeeItem 
                            item={application} 
                            isImageItem={true}
                        />
                    })
                )
            }
        </>
        {
            items?.slice(3)?.length > 0 ?
                <EmployeeItem
                    item={`+${items?.slice(3)?.length}`}
                />
            :
            <></>
        }
    </div>
}