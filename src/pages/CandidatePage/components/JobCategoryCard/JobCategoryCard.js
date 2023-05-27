import "./style.css";


const JobCategoryCard = ({ title, categoryImage, subtitle, handleCardClick }) => {
    return <>
        <div className="candidate__Job__Category__Card" onClick={handleCardClick}>
            <p className="category__Title">{title}</p>
            <img src={categoryImage} alt={title} />
            <p className="category__Subtitle">{subtitle}</p>
        </div>
    </>
}

export default JobCategoryCard;