import styles from './styles.module.css';


export default function InternetLoader ({ 
    color,
    width,
    height,
}) {
    return <div 
        className={styles.custom_loader}
        style={{
            background: color ? 
                `linear-gradient(${color} 0 0) left/0% 100% no-repeat #E4E4ED;`
            :
            'linear-gradient(#005734 0 0) left/0% 100% no-repeat #E4E4ED',
            width: width ? width : '60px',
            height: height ? height : '45px',
        }}
    ></div>
}