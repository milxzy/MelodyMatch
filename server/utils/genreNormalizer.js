/**
 * Genre Normalizer - Maps platform-specific genre names to canonical forms
 * Handles variations in genre naming across Spotify, Apple Music, YouTube Music
 */

/**
 * Comprehensive genre alias mapping
 * Key = canonical genre name
 * Value = array of variations/aliases
 */
export const genreAliases = {
  // Pop
  'pop': ['pop music', 'popular', 'pop/rock', 'mainstream pop', 'dance pop'],
  'indie pop': ['indie-pop', 'indiepop', 'indie pop/rock'],
  'synth pop': ['synth-pop', 'synthpop', 'electro pop', 'electropop'],
  'k-pop': ['kpop', 'k pop', 'korean pop'],
  'j-pop': ['jpop', 'j pop', 'japanese pop'],
  
  // Rock
  'rock': ['rock music', 'rock & roll', 'rock and roll', 'rock n roll'],
  'indie rock': ['indie', 'alternative', 'alt-rock', 'alternative rock', 'indie/alternative'],
  'hard rock': ['metal', 'heavy metal', 'hard rock'],
  'punk rock': ['punk', 'punk rock', 'pop punk', 'pop-punk'],
  'classic rock': ['classic rock', 'classic rock & roll'],
  'progressive rock': ['prog rock', 'progressive', 'prog'],
  'psychedelic rock': ['psychedelic', 'psych rock', 'psychedelia'],
  'folk rock': ['folk-rock', 'folk rock'],
  'garage rock': ['garage', 'garage rock'],
  
  // Hip-Hop & Rap
  'hip hop': ['rap', 'hip-hop', 'hiphop', 'hip hop/rap', 'rap/hip-hop'],
  'trap': ['trap music', 'trap rap'],
  'lo-fi hip hop': ['lofi', 'lo-fi', 'lofi hip hop', 'chillhop'],
  'conscious hip hop': ['conscious rap', 'political rap'],
  
  // Electronic & Dance
  'electronic': ['edm', 'electro', 'electronic music', 'dance', 'electronic/dance'],
  'house': ['deep house', 'tech house', 'progressive house', 'house music'],
  'techno': ['techno music', 'detroit techno'],
  'dubstep': ['dubstep', 'brostep'],
  'drum and bass': ['dnb', 'd&b', 'drum & bass', 'drum n bass'],
  'trance': ['trance music', 'progressive trance'],
  'ambient': ['ambient music', 'ambient electronic'],
  'downtempo': ['downtempo', 'chillout', 'chill'],
  
  // R&B & Soul
  'r&b': ['r & b', 'rnb', 'r and b', 'rhythm and blues', 'contemporary r&b'],
  'soul': ['soul music', 'neo-soul', 'neo soul'],
  'funk': ['funk music', 'p-funk'],
  
  // Jazz
  'jazz': ['jazz music'],
  'smooth jazz': ['smooth jazz', 'contemporary jazz'],
  'bebop': ['bebop', 'bop'],
  'fusion': ['jazz fusion', 'fusion jazz'],
  
  // Country
  'country': ['country music', 'country & western'],
  'alt-country': ['alternative country', 'alt country', 'americana'],
  'bluegrass': ['bluegrass music'],
  
  // Latin
  'latin': ['latin music', 'latino'],
  'reggaeton': ['reggaeton', 'reggaetón'],
  'salsa': ['salsa music'],
  'bachata': ['bachata music'],
  'merengue': ['merengue music'],
  
  // Reggae
  'reggae': ['reggae music'],
  'dancehall': ['dancehall', 'dance hall'],
  'ska': ['ska music'],
  
  // Blues
  'blues': ['blues music', 'electric blues', 'delta blues'],
  
  // Classical
  'classical': ['classical music', 'orchestral'],
  'baroque': ['baroque music'],
  'romantic': ['romantic music', 'romantic era'],
  
  // World
  'world': ['world music'],
  'afrobeat': ['afrobeat', 'afrobeats'],
  'bossa nova': ['bossa nova', 'brazilian jazz'],
  
  // Indie & Alternative
  'alternative': ['alternative rock', 'alt rock', 'modern rock'],
  'indie': ['independent', 'indie music'],
  'shoegaze': ['shoegaze', 'shoe gaze'],
  'dream pop': ['dream pop', 'dreampop'],
  
  // Metal
  'metal': ['heavy metal', 'metal music'],
  'death metal': ['death metal'],
  'black metal': ['black metal'],
  'thrash metal': ['thrash', 'thrash metal'],
  
  // Experimental
  'experimental': ['experimental music', 'avant-garde'],
  'noise': ['noise music', 'noise rock'],
  
  // Folk
  'folk': ['folk music', 'contemporary folk'],
  'singer-songwriter': ['singer/songwriter', 'singer songwriter'],
  
  // Soundtrack
  'soundtrack': ['film soundtrack', 'ost', 'original soundtrack'],
  'video game music': ['vgm', 'game music', 'video game ost']
};

/**
 * Normalize a genre string to its canonical form
 * @param {string} genre - Raw genre name from any platform
 * @returns {string} Canonical genre name
 */
export function normalizeGenre(genre) {
  if (!genre || typeof genre !== 'string') {
    return '';
  }

  const lowerGenre = genre.toLowerCase().trim();
  
  // Check if it's already a canonical genre
  if (genreAliases[lowerGenre]) {
    return lowerGenre;
  }
  
  // Search through aliases to find canonical form
  for (const [canonical, aliases] of Object.entries(genreAliases)) {
    if (aliases.includes(lowerGenre)) {
      return canonical;
    }
  }
  
  // If no mapping found, return cleaned version
  return lowerGenre;
}

/**
 * Normalize an array of genres
 * @param {Array<string>} genres - Array of genre names
 * @returns {Array<string>} Array of normalized canonical genres (deduplicated)
 */
export function normalizeGenres(genres) {
  if (!Array.isArray(genres)) {
    return [];
  }
  
  const normalized = genres
    .map(g => normalizeGenre(g))
    .filter(g => g !== ''); // Remove empty strings
  
  // Deduplicate
  return [...new Set(normalized)];
}

/**
 * Get all variations of a canonical genre
 * @param {string} canonicalGenre - Canonical genre name
 * @returns {Array<string>} Array including canonical + all aliases
 */
export function getGenreVariations(canonicalGenre) {
  const canonical = canonicalGenre.toLowerCase();
  
  if (genreAliases[canonical]) {
    return [canonical, ...genreAliases[canonical]];
  }
  
  return [canonical];
}

/**
 * Calculate similarity between two genre sets (for matching)
 * @param {Array<string>} genres1 - First user's genres
 * @param {Array<string>} genres2 - Second user's genres
 * @returns {number} Similarity score 0-1
 */
export function calculateGenreSimilarity(genres1, genres2) {
  if (!genres1?.length || !genres2?.length) {
    return 0;
  }

  const normalized1 = normalizeGenres(genres1);
  const normalized2 = normalizeGenres(genres2);

  // Find common genres
  const common = normalized1.filter(g => normalized2.includes(g));
  
  // Jaccard similarity coefficient
  const union = new Set([...normalized1, ...normalized2]);
  return common.length / union.size;
}

export default {
  normalizeGenre,
  normalizeGenres,
  getGenreVariations,
  calculateGenreSimilarity,
  genreAliases
};
