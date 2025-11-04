// music similarity matching algorithm
// calculates compatibility score between two users based on their music preferences

/**
 * calculate genre similarity between two users
 * @param {Array} userGenres - genres of first user
 * @param {Array} otherUserGenres - genres of second user
 * @returns {number} - similarity score between 0 and 1
 */
export const calculateGenreSimilarity = (userGenres, otherUserGenres) => {
  if (!Array.isArray(userGenres) || !Array.isArray(otherUserGenres)) {
    return 0;
  }

  if (userGenres.length === 0 || otherUserGenres.length === 0) {
    return 0;
  }

  // convert to lowercase for case-insensitive comparison
  const user1Genres = userGenres.map(g => g.toLowerCase());
  const user2Genres = otherUserGenres.map(g => g.toLowerCase());

  // find common genres
  const commonGenres = user1Genres.filter(genre => user2Genres.includes(genre));

  // calculate jaccard similarity coefficient
  const unionSize = new Set([...user1Genres, ...user2Genres]).size;
  const similarity = commonGenres.length / unionSize;

  return similarity;
};

/**
 * calculate artist similarity between two users
 * @param {Array} userArtists - artists followed by first user
 * @param {Array} otherUserArtists - artists followed by second user
 * @returns {number} - similarity score between 0 and 1
 */
export const calculateArtistSimilarity = (userArtists, otherUserArtists) => {
  if (!Array.isArray(userArtists) || !Array.isArray(otherUserArtists)) {
    return 0;
  }

  if (userArtists.length === 0 || otherUserArtists.length === 0) {
    return 0;
  }

  // convert to lowercase for case-insensitive comparison
  const user1Artists = userArtists.map(a => a.toLowerCase());
  const user2Artists = otherUserArtists.map(a => a.toLowerCase());

  // find common artists
  const commonArtists = user1Artists.filter(artist => user2Artists.includes(artist));

  // calculate jaccard similarity coefficient
  const unionSize = new Set([...user1Artists, ...user2Artists]).size;
  const similarity = commonArtists.length / unionSize;

  return similarity;
};

/**
 * calculate overall music compatibility between two users
 * @param {Object} user1 - first user object with genres and artists
 * @param {Object} user2 - second user object with genres and artists
 * @returns {Object} - compatibility score and breakdown
 */
export const calculateMusicCompatibility = (user1, user2) => {
  const genreSimilarity = calculateGenreSimilarity(user1.genres, user2.genres);
  const artistSimilarity = calculateArtistSimilarity(user1.artists, user2.artists);

  // weighted average: genres 60%, artists 40%
  const overallScore = (genreSimilarity * 0.6) + (artistSimilarity * 0.4);

  // calculate percentage
  const compatibilityPercentage = Math.round(overallScore * 100);

  return {
    score: overallScore,
    percentage: compatibilityPercentage,
    genreMatch: Math.round(genreSimilarity * 100),
    artistMatch: Math.round(artistSimilarity * 100),
    level: getCompatibilityLevel(compatibilityPercentage)
  };
};

/**
 * get compatibility level based on percentage
 * @param {number} percentage - compatibility percentage
 * @returns {string} - compatibility level description
 */
const getCompatibilityLevel = (percentage) => {
  if (percentage >= 80) return 'perfect match';
  if (percentage >= 60) return 'great match';
  if (percentage >= 40) return 'good match';
  if (percentage >= 20) return 'fair match';
  return 'low match';
};

/**
 * sort users by compatibility with target user
 * @param {Object} targetUser - user to compare against
 * @param {Array} users - array of users to sort
 * @returns {Array} - sorted array of users with compatibility scores
 */
export const sortUsersByCompatibility = (targetUser, users) => {
  return users
    .map(user => ({
      ...user,
      compatibility: calculateMusicCompatibility(targetUser, user)
    }))
    .sort((a, b) => b.compatibility.score - a.compatibility.score);
};

/**
 * filter users by minimum compatibility threshold
 * @param {Object} targetUser - user to compare against
 * @param {Array} users - array of users to filter
 * @param {number} minPercentage - minimum compatibility percentage (default 20)
 * @returns {Array} - filtered users meeting threshold
 */
export const filterByCompatibility = (targetUser, users, minPercentage = 20) => {
  return users.filter(user => {
    const compatibility = calculateMusicCompatibility(targetUser, user);
    return compatibility.percentage >= minPercentage;
  });
};
