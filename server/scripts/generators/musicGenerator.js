// Music taste generation utilities implementing different strategies

import { artistsByGenre, getArtistsForGenres, getRandomArtistsFromGenre } from '../data/artists.js';
import { 
  getAllGenres, 
  getRandomWeightedGenre, 
  getRelatedGenres, 
  buildGenreArray,
  clusters 
} from '../data/genres.js';

/**
 * Strategy 1: Diverse Distribution
 * Evenly distributed across all genres for testing full spectrum
 */
export function generateDiverseMusic() {
  const allGenres = getAllGenres();
  
  // Pick 3-5 random genres
  const genreCount = Math.floor(Math.random() * 3) + 3; // 3-5
  const shuffled = [...allGenres].sort(() => Math.random() - 0.5);
  const selectedGenres = shuffled.slice(0, genreCount);
  
  // Build genre array with subgenres
  const genres = buildGenreArray(selectedGenres);
  
  // Get 10-15 artists from selected genres
  const artistCount = Math.floor(Math.random() * 6) + 10; // 10-15
  const artists = selectRandomArtistsFromGenres(selectedGenres, artistCount);
  
  return { genres, artists };
}

/**
 * Strategy 2: Clustered Distribution
 * Creates music communities with similar tastes
 */
export function generateClusteredMusic(clusterType) {
  const cluster = clusters[clusterType];
  if (!cluster) {
    throw new Error(`Unknown cluster type: ${clusterType}`);
  }
  
  // Select 2-3 primary genres from cluster
  const primaryCount = Math.floor(Math.random() * 2) + 2; // 2-3
  const primaryGenres = [...cluster.primaryGenres]
    .sort(() => Math.random() - 0.5)
    .slice(0, primaryCount);
  
  // Maybe add 1-2 secondary genres
  const secondaryCount = Math.random() < 0.6 ? Math.floor(Math.random() * 2) + 1 : 0;
  const secondaryGenres = [...cluster.secondaryGenres]
    .sort(() => Math.random() - 0.5)
    .slice(0, secondaryCount);
  
  const selectedGenres = [...primaryGenres, ...secondaryGenres];
  
  // Build genre array with subgenres
  const genres = buildGenreArray(selectedGenres);
  
  // Get 12-18 artists from selected genres (more focused)
  const artistCount = Math.floor(Math.random() * 7) + 12; // 12-18
  const artists = selectRandomArtistsFromGenres(selectedGenres, artistCount);
  
  return { genres, artists };
}

/**
 * Strategy 3: Realistic Distribution
 * Mirrors real-world Spotify listening patterns
 */
export function generateRealisticMusic() {
  // Pick 3-5 genres with weighted probability
  const genreCount = Math.floor(Math.random() * 3) + 3; // 3-5
  const selectedGenres = [];
  
  for (let i = 0; i < genreCount; i++) {
    let genre;
    // Ensure no duplicates
    do {
      genre = getRandomWeightedGenre();
    } while (selectedGenres.includes(genre));
    selectedGenres.push(genre);
  }
  
  // Build genre array with subgenres
  const genres = buildGenreArray(selectedGenres);
  
  // Get 10-15 artists from selected genres
  const artistCount = Math.floor(Math.random() * 6) + 10; // 10-15
  const artists = selectRandomArtistsFromGenres(selectedGenres, artistCount);
  
  return { genres, artists };
}

/**
 * Strategy 4: Custom Distribution
 * User-defined artists and genres with prevalence weights
 */
export function generateCustomMusic(customArtists, customGenres, userIndex, totalUsers) {
  const selectedGenres = [];
  const selectedArtists = [];
  
  // Process custom genres with prevalence
  if (customGenres && Object.keys(customGenres).length > 0) {
    for (const [genre, percentage] of Object.entries(customGenres)) {
      // Calculate if this user should get this genre
      const threshold = percentage / 100;
      if (Math.random() < threshold) {
        selectedGenres.push(genre);
      }
    }
    
    // Ensure at least 2 genres
    if (selectedGenres.length < 2) {
      const allGenres = getAllGenres();
      while (selectedGenres.length < 2) {
        const randomGenre = allGenres[Math.floor(Math.random() * allGenres.length)];
        if (!selectedGenres.includes(randomGenre)) {
          selectedGenres.push(randomGenre);
        }
      }
    }
    
    // Add related genres if we have less than 4
    if (selectedGenres.length < 4) {
      const related = getRelatedGenres(selectedGenres[0], 2);
      related.forEach(g => {
        if (!selectedGenres.includes(g)) {
          selectedGenres.push(g);
        }
      });
    }
  } else {
    // No custom genres, use diverse strategy
    const allGenres = getAllGenres();
    const shuffled = [...allGenres].sort(() => Math.random() - 0.5);
    selectedGenres.push(...shuffled.slice(0, 4));
  }
  
  // Process custom artists with prevalence
  if (customArtists && Object.keys(customArtists).length > 0) {
    for (const [artist, percentage] of Object.entries(customArtists)) {
      const threshold = percentage / 100;
      if (Math.random() < threshold) {
        selectedArtists.push(artist);
      }
    }
  }
  
  // Fill remaining artist slots from selected genres
  const targetArtistCount = Math.floor(Math.random() * 6) + 10; // 10-15 total
  const remainingSlots = targetArtistCount - selectedArtists.length;
  
  if (remainingSlots > 0) {
    const genreArtists = selectRandomArtistsFromGenres(selectedGenres, remainingSlots);
    // Filter out any duplicates
    genreArtists.forEach(artist => {
      if (!selectedArtists.includes(artist)) {
        selectedArtists.push(artist);
      }
    });
  }
  
  // Build genre array with subgenres
  const genres = buildGenreArray(selectedGenres);
  
  return { genres, artists: selectedArtists };
}

/**
 * Helper: Select random artists from given genres
 */
function selectRandomArtistsFromGenres(genres, count) {
  const artists = new Set();
  
  // Get all available artists from these genres
  const availableArtists = [];
  genres.forEach(genre => {
    const genreArtists = artistsByGenre[genre] || [];
    availableArtists.push(...genreArtists);
  });
  
  // Shuffle and select
  const shuffled = [...availableArtists].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    artists.add(shuffled[i]);
  }
  
  // If we don't have enough artists, it's okay - return what we have
  return Array.from(artists);
}

/**
 * Get cluster type for a user based on their index
 * Used by clustered strategy to evenly distribute users across clusters
 */
export function getClusterForUser(userIndex, totalUsers) {
  const clusterTypes = Object.keys(clusters);
  const clusterIndex = userIndex % clusterTypes.length;
  return clusterTypes[clusterIndex];
}
