import Avatar from "react-avatar";
import styles from "./styles.module.css";

export default function CardTile ({ 
    tileName,
    tileDesignation, 
    tileColor,
    hasTrailingDash,
    hasLeadingDash,
    isClickable,
    tileHasChildren,
    hasSingleChild,
}) {
    return <>
    
        {
            hasLeadingDash && <div className={styles.dash__Wrap}>
                <div className={styles.trail__dash}></div>
            </div>
        }
        <div className={styles.card__Tile}>
            <Avatar
                name={
                    tileName
                }
                round={true}
                size='3rem'
            />
            <div>
                <h5 className={styles.title}>{tileName}</h5>
                <p 
                    style={
                        Object.assign(
                            {},
                            { 
                                backgroundColor: tileColor ? tileColor : '#f2f2f2'
                            },
                            !tileColor ? 
                                { color: '#000' } 
                            : 
                            {}
                        )
                    } 
                    className={styles.designation}
                >
                    {tileDesignation}
                </p>
            </div>
        </div>
        {
            hasTrailingDash && <div className={styles.dash__Wrap}>
                <div className={styles.trail__dash}></div>
            </div>
        }
    </>
}