import React from "react";
import EmployeeItem from "../EmployeeItem/EmployeeItem";
import styles from "./styles.module.css";

export default function UserIconsInfo ({ items, numberOfIcons, isNotEmployeeItem }) {
    if (!items || !Array.isArray(items) || isNaN(numberOfIcons)) return <></>

    return <div className={styles.nav__Users__Content}>
        <>
            {
                React.Children.toArray(
                    items?.slice(0, numberOfIcons)?.map(application => {
                        return <EmployeeItem 
                            item={application} 
                            isImageItem={true}
                            isNotEmployeeItem={isNotEmployeeItem}
                        />
                    })
                )
            }
        </>
        {
            items?.slice(numberOfIcons)?.length > 0 ?
                <EmployeeItem
                    item={`+${items?.slice(numberOfIcons)?.length}`}
                    isNotEmployeeItem={isNotEmployeeItem}
                />
            :
            <></>
        }
    </div>
}