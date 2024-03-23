import styles from "./styles.module.css";


const ItemFeatureCard = ({
    handleFeatureCardClick,
    featureIcon,
    featureTitle,
    featureDescription,
}) => {
    return <>
        <div
            className={styles.Create_Team}
            onClick={
                handleFeatureCardClick && typeof handleFeatureCardClick === 'function' ?
                    () => handleFeatureCardClick()
                :
                () => {}
            }
        >
            <div>
                <div className={styles.icon__Wrap}>
                    {featureIcon}
                </div>
                <h4>{featureTitle}</h4>
                <p>
                    {featureDescription}
                </p>
            </div>
        </div>
    </>
}

export default ItemFeatureCard;