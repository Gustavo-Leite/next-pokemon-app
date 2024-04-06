'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SearchBar } from '@/shared/components/search-bar/searchBarComponent';
import { fetchPokemonList } from '@/shared/services/pokemonService';
import PokemonBox from '@/shared/components/pokemon-box/pokemonBoxComponent';


export default function PokemonPage() {

  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(1);
  const isFirstPageLoaded = useRef(false);

  const Retries = 3;
  const RetryInterval = 3000;

  const fetchPokemonData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPokemonList(pageRef.current);
      setPokemonList(prevList => (isFirstPageLoaded.current ? [...prevList, ...data] : data));
      setFilteredPokemonList(prevList => (isFirstPageLoaded.current ? [...prevList, ...data] : data));
      isFirstPageLoaded.current = true;
      setRetryCount(0);
    } catch (error) {
      console.error(error.message);
      if (retryCount < Retries) {
        setTimeout(fetchPokemonData, RetryInterval);
        setRetryCount(retryCount + 1);
      } else {
        console.error('Max retry attempts reached. Could not fetch Pokémon list.');
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchPokemonData();
  }, [fetchPokemonData]);

  const handleSearch = (query) => {
    const filteredData = query !== ''
      ? pokemonList.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      : pokemonList;
    setFilteredPokemonList(filteredData);
  };

  const loadMorePokemon = useCallback(() => {
    if (!loading) {
      pageRef.current++;
      fetchPokemonData();
    }
  }, [loading, fetchPokemonData]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight && !loading) {
        loadMorePokemon();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, loadMorePokemon]);

  const searchBar = pokemonList.length > 0 && (
    <div className='flex justify-center mt-4 mb-8'>
      <SearchBar data={pokemonList} setData={setFilteredPokemonList} setSearch={handleSearch} />
    </div>
  );

  const uniqueFilteredPokemonList = filteredPokemonList.filter((pokemon, index, self) =>
    index === self.findIndex(p => p.name === pokemon.name)
  );

  return (
    <div className='min-h-[100vh] w-full bg-slate-900 flex flex-col items-center sm:p-8'>
      {searchBar}
      {filteredPokemonList.length === 0 && (
        <div className='min-h-[70vh] flex justify-center items-center'>
          <div className='text-blue-300 font-bold text-lg'>No Pokémon found.</div>
        </div>
      )}
      {uniqueFilteredPokemonList.length > 0 && (
        <div className='sm:bg-slate-600 min-h-[70vh] grid grid-cols-1 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:rounded-md border-solid sm:border border-slate-50/50 p-8 gap-6'>
          {uniqueFilteredPokemonList.map((pokemon, index) => (
            <PokemonBox key={index} pokemonName={pokemon.name} />
          ))}
          {loading && <div className='font-medium text-blue-400'>Loading...</div>}
        </div>
      )}
    </div>
  );
}
