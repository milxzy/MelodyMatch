// Genre definitions with metadata for realistic music distribution
// Weights represent realistic distribution percentages in the wild

export const genres = {
  // Mainstream genres (high weight)
  pop: { 
    weight: 30, 
    subgenres: ['synth-pop', 'indie pop', 'electropop', 'pop rock', 'dance-pop'],
    cluster: 'pop-electronic'
  },
  'hip-hop': { 
    weight: 25, 
    subgenres: ['trap', 'conscious rap', 'drill', 'mumble rap', 'boom bap'],
    cluster: 'hip-hop-rnb'
  },
  rock: { 
    weight: 20, 
    subgenres: ['alternative rock', 'indie rock', 'punk rock', 'hard rock', 'progressive rock'],
    cluster: 'rock-metal'
  },
  electronic: { 
    weight: 15, 
    subgenres: ['house', 'techno', 'dubstep', 'edm', 'trance', 'drum and bass'],
    cluster: 'pop-electronic'
  },
  
  // Mid-tier genres
  'r&b': { 
    weight: 12, 
    subgenres: ['neo-soul', 'contemporary r&b', 'alternative r&b'],
    cluster: 'hip-hop-rnb'
  },
  indie: { 
    weight: 10, 
    subgenres: ['indie folk', 'indie rock', 'bedroom pop', 'indie pop'],
    cluster: 'indie-alternative'
  },
  metal: { 
    weight: 8, 
    subgenres: ['metalcore', 'death metal', 'progressive metal', 'thrash metal', 'black metal'],
    cluster: 'rock-metal'
  },
  country: { 
    weight: 7, 
    subgenres: ['country pop', 'alt-country', 'country rock', 'bluegrass'],
    cluster: 'country-folk'
  },
  
  // Niche genres (lower weight)
  jazz: { 
    weight: 5, 
    subgenres: ['smooth jazz', 'fusion', 'bebop', 'contemporary jazz'],
    cluster: 'jazz-soul'
  },
  classical: { 
    weight: 4, 
    subgenres: ['romantic', 'contemporary classical', 'baroque', 'orchestral'],
    cluster: 'classical-ambient'
  },
  latin: { 
    weight: 6, 
    subgenres: ['reggaeton', 'latin pop', 'bachata', 'salsa', 'latin trap'],
    cluster: 'latin'
  },
  punk: { 
    weight: 5, 
    subgenres: ['pop punk', 'hardcore punk', 'post-punk', 'skate punk'],
    cluster: 'punk-alternative'
  },
  folk: { 
    weight: 4, 
    subgenres: ['contemporary folk', 'americana', 'indie folk', 'folk rock'],
    cluster: 'country-folk'
  },
  soul: { 
    weight: 5, 
    subgenres: ['neo-soul', 'southern soul', 'motown', 'funk soul'],
    cluster: 'jazz-soul'
  },
  reggae: { 
    weight: 3, 
    subgenres: ['dancehall', 'roots reggae', 'dub', 'reggae fusion'],
    cluster: 'reggae'
  },
  blues: { 
    weight: 3, 
    subgenres: ['electric blues', 'delta blues', 'chicago blues', 'blues rock'],
    cluster: 'blues-rock'
  },
  funk: { 
    weight: 4, 
    subgenres: ['p-funk', 'jazz-funk', 'funk rock', 'electro-funk'],
    cluster: 'funk-soul'
  },
  disco: { 
    weight: 2, 
    subgenres: ['nu-disco', 'disco-funk', 'space disco'],
    cluster: 'disco-funk'
  },
  ambient: { 
    weight: 3, 
    subgenres: ['ambient techno', 'dark ambient', 'drone', 'soundscape'],
    cluster: 'classical-ambient'
  },
  experimental: { 
    weight: 2, 
    subgenres: ['avant-garde', 'noise', 'glitch', 'industrial'],
    cluster: 'experimental'
  },
  alternative: { 
    weight: 8, 
    subgenres: ['alt-rock', 'alternative indie', 'grunge', 'shoegaze'],
    cluster: 'indie-alternative'
  }
};

// Cluster definitions for clustered strategy
export const clusters = {
  'indie-alternative': {
    name: 'Indie/Alternative',
    primaryGenres: ['indie', 'alternative', 'indie pop'],
    secondaryGenres: ['folk', 'rock']
  },
  'hip-hop-rnb': {
    name: 'Hip-Hop/R&B',
    primaryGenres: ['hip-hop', 'r&b', 'trap'],
    secondaryGenres: ['soul', 'pop']
  },
  'rock-metal': {
    name: 'Rock/Metal',
    primaryGenres: ['rock', 'metal', 'hard rock'],
    secondaryGenres: ['punk', 'alternative', 'blues']
  },
  'pop-electronic': {
    name: 'Pop/Electronic',
    primaryGenres: ['pop', 'electronic', 'edm'],
    secondaryGenres: ['disco', 'synth-pop', 'dance-pop']
  }
};

// Get all genre names
export function getAllGenres() {
  return Object.keys(genres);
}

// Get genres by weight (for realistic distribution)
export function getWeightedGenres() {
  return Object.entries(genres).map(([name, data]) => ({
    name,
    weight: data.weight,
    cluster: data.cluster
  }));
}

// Get random genre based on weights
export function getRandomWeightedGenre() {
  const totalWeight = Object.values(genres).reduce((sum, g) => sum + g.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const [name, data] of Object.entries(genres)) {
    random -= data.weight;
    if (random <= 0) {
      return name;
    }
  }
  
  return 'pop'; // fallback
}

// Get related genres based on cluster
export function getRelatedGenres(genre, count = 3) {
  const genreData = genres[genre];
  if (!genreData) return [];
  
  const clusterName = genreData.cluster;
  const relatedGenres = Object.entries(genres)
    .filter(([name, data]) => data.cluster === clusterName && name !== genre)
    .map(([name]) => name);
  
  // Shuffle and return requested count
  return relatedGenres.sort(() => Math.random() - 0.5).slice(0, count);
}

// Get subgenres for a genre
export function getSubgenres(genre) {
  const genreData = genres[genre];
  return genreData ? genreData.subgenres : [];
}

// Build genre array with subgenres
export function buildGenreArray(primaryGenres) {
  const genreArray = [...primaryGenres];
  
  // Add some subgenres for variety
  primaryGenres.forEach(genre => {
    const subgenres = getSubgenres(genre);
    if (subgenres.length > 0) {
      const randomSubgenre = subgenres[Math.floor(Math.random() * subgenres.length)];
      genreArray.push(randomSubgenre);
    }
  });
  
  return genreArray;
}
