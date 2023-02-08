import { BiSearchAlt } from "react-icons/bi";
import "./style.css";

const SearchBar = ({ searchValue, handleSearchChange, placeholder }) => {
    return <>
        <div className="search__Navigation__Bar">
            <BiSearchAlt className="search__Icon" />
            <input type={"text"} value={searchValue ? searchValue : ""} onChange={handleSearchChange ? (e) => handleSearchChange(e.target.value) : () => {}} placeholder={placeholder ? placeholder : "Search by skill, job"} />
        </div>
    </>
}

export default SearchBar;