import styles from './styles.module.css';


const HorizontalBarLoader = ({ width, height }) => {
    const customStyles = {
        width: width ? width : '100.8px',
        height: height ? height : '16.8px'
    }
    return <>
        <div style={customStyles} className={styles.progress}></div>
    </>
}

export default HorizontalBarLoader