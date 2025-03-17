// Name and credential generation utilities

export function generateEmail(index) {
  return `bot${index}@melodymatch.test`;
}

export function generateSpotifyId(index) {
  // Pad with leading zeros for consistent format
  const paddedIndex = String(index).padStart(3, '0');
  return `bot_spotify_${paddedIndex}`;
}

export function generatePassword() {
  // All bots use the same password for simplicity
  return 'TestPass123!';
}

export function generateProfilePicture(index, gender = 'non-binary') {
  // All bots get profile pictures (will be first image from pictures array)
  // Using HD 1000px pravatar for main profile pic
  return `https://i.pravatar.cc/1000?img=${index}`;
}
