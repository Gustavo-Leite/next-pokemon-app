import { useState, useEffect } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import axiosInstance from '@/shared/services/api/axios-config';
import { PokemonStyles } from './pokemonBoxStyles';


const PokemonBox = ({ pokemonName }) => {

  const [pokemonData, setPokemonData] = useState(null); 4;
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonAbilities, setPokemonAbilities] = useState([]);
  const [pokemonStats, setPokemonStats] = useState([]);

  useEffect(() => {
    async function fetchPokemonData() {
      try {
        const response = await axiosInstance.get(`pokemon/${pokemonName}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch Pokémon info');
        }
        setPokemonData(response.data);

        fetchPokemonTypes();
        fetchPokemonAbilities();
        fetchPokemonStats();
      } catch (error) {
        console.error(`Error fetching Pokémon info for ${pokemonName}:`, error);
      }
    }

    async function fetchPokemonTypes() {
      try {
        const response = await axiosInstance.get(`pokemon/${pokemonName}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch Pokémon types');
        }
        const types = response.data.types.map(type => type.type.name);
        setPokemonTypes(types);
      } catch (error) {
        console.error(`Error fetching Pokémon types for ${pokemonName}:`, error);
      }
    }

    async function fetchPokemonAbilities() {
      try {
        const response = await axiosInstance.get(`pokemon/${pokemonName}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch Pokémon abilities');
        }
        const abilities = response.data.abilities.map(ability => ability.ability.name);
        setPokemonAbilities(abilities);
      } catch (error) {
        console.error(`Error fetching Pokémon abilities for ${pokemonName}:`, error);
      }
    }

    async function fetchPokemonStats() {
      try {
        const response = await axiosInstance.get(`pokemon/${pokemonName}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch Pokémon stats');
        }
        const stats = response.data.stats.map(stat => ({
          name: formatStatName(stat.stat.name),
          value: stat.base_stat
        }));
        setPokemonStats(stats);
      } catch (error) {
        console.error(`Error fetching Pokémon stats for ${pokemonName}:`, error);
      }
    }

    function formatStatName(name) {
      return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    fetchPokemonData();
  }, [pokemonName]);

  if (!pokemonData) {
    return <div className='font-medium text-blue-400'>Loading...</div>;
  }

  return (
    <Dialog.Root>

      <Dialog.Trigger>
        <div className={PokemonStyles.case}>
          <div className={PokemonStyles.div}>
            <span className={PokemonStyles.name}>{pokemonData.name}</span>
          </div>
          <div className='w-full flex justify-center gap-2'>
            <span className={PokemonStyles.info}>Pokédex number:</span>
            <span className={PokemonStyles.info}>{pokemonData.id}</span>
          </div>
          <div className={PokemonStyles.div}>
            <Image
              src={pokemonData.sprites.front_default}
              alt={pokemonData.name}
              width={PokemonStyles.width}
              height={PokemonStyles.height}
              priority
            />
          </div>
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50' />
        <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:min-h-[50vh] justify-center bg-slate-700 md:rounded-md flex md:flex-col outline-none py-5'>
          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5' />
          </Dialog.Close>
          <div className='flex flex-col justify-around mt-12 md:mt-0 md:grid md:grid-cols-2 h-96 p-6 gap-4'>
            <div className='flex flex-col gap-2 ml-5 justify-around'>
              <div className='p-2 rounded-md border border-solid border-slate-300/10'>
                <div className='flex flex-col mb-2'>
                  <span className={PokemonStyles.name}>{pokemonData.name}</span>
                </div>
                <div className='w-full flex items-center gap-3'>
                  <span className={PokemonStyles.infoDetail}>Pokédex number:</span>
                  <span className={PokemonStyles.info}>{pokemonData.id}</span>
                </div>
                <div>
                  <span className={PokemonStyles.infoDetail}>Types: </span>
                  <span className={PokemonStyles.info}>{pokemonTypes.join(', ')}</span>
                </div>
                <div>
                  <span className={PokemonStyles.infoDetail}>Skills: </span>
                  {pokemonAbilities.map((ability, index) => (
                    <span key={index} className={PokemonStyles.info}>{ability}</span>
                  ))}
                </div>
              </div>
              <div className='p-2 mt-2 rounded-md border border-solid border-slate-300/10'>
                <span className='text-lg font-medium text-blue-400'>Basic Statistics</span>
                {pokemonStats.map((stat, index) => (
                  <div key={index}>
                    <span className={PokemonStyles.infoDetail}>{stat.name}: </span>
                    <span className={PokemonStyles.BaseStatistics}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex justify-center items-center'>
              <div>
                <Image
                  src={pokemonData.sprites.front_default}
                  alt={pokemonData.name}
                  width={PokemonStyles.widthDetail}
                  height={PokemonStyles.heightDetail}
                  priority
                />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PokemonBox;
