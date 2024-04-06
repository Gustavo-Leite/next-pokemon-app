import { useState } from 'react';
import { SearchStyles } from './searchBarStyles';

export function SearchBar({ data, setData }) {

  const [search, setSearch] = useState('');

  let debounceTimeout;

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearch(query);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
      const filteredData = query !== ''
        ? data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
        : data;
      const sortedFilteredData = filteredData.sort((a, b) => {
        if (a.name.toLowerCase().startsWith(query.toLowerCase()) && !b.name.toLowerCase().startsWith(query.toLowerCase())) {
          return -1;
        } else if (!a.name.toLowerCase().startsWith(query.toLowerCase()) && b.name.toLowerCase().startsWith(query.toLowerCase())) {
          return 1;
        } else {
          return a.name.localeCompare(b.name);
        }
      });
      setData(sortedFilteredData);
    }, 300);
  };

  return (
    <input
      type='text'
      placeholder='Search Pokémon...'
      className={SearchStyles.bar}
      value={search}
      onChange={handleSearch}
    />
  );
}
