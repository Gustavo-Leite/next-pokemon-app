import axiosInstance from '@/shared/services/api/axios-config';

const PageSize = 20;

export async function fetchPokemonList(page) {
  try {
    const response = await axiosInstance.get(`pokemon?limit=${PageSize}&offset=${(page - 1) * PageSize}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch Pokémon list');
    }
    return response.data.results;
  } catch (error) {
    throw new Error(`Error fetching Pokémon list: ${error.message}`);
  }
}