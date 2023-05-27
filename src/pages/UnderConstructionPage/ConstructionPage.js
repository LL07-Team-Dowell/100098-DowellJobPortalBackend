import "./style.css";


export const PageUnderConstruction = () => {
    return <div className="construction__Page__Container">
        <img src={process.env.PUBLIC_URL + '/under-constructions.svg'} alt='page under construction' />
    </div>
}
