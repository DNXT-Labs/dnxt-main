import { useState } from 'react';

const SearchFilter = ({ onSearch, nftData }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    onSearch(searchValue);
  };

  return (
    <div className="search-container">
      <input className='input'
        type="text" 
        placeholder="Search..." 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
      />
      
      <button className='button' onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchFilter;
