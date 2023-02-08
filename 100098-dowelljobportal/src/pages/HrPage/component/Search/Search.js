import React from 'react';
import './Search.css';
import { BsMic } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';

function Search({ searchValue, updateSearchValue, handleFormSubmit }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit && handleFormSubmit();
  }

  return (
    <div className='search__wrapper'>
        <div className='search__container'>
           <form onSubmit={handleSubmit}>
              <input type='search' placeholder='Search by skill, job' value={searchValue} onChange={(e) => updateSearchValue(e.target.value)} />
              <button type='record' onSubmit={() => {}}> <BsMic className='btn'/></button>
              <button type='submit'><FiSearch/></button>
              
           </form>

        </div>
    </div>
  )
}

export default Search
