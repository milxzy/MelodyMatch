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

export function generateProfilePicture(index) {
  // 70% of bots get profile pictures, 30% get null
  if (Math.random() < 0.3) {
    return null;
  }
  
  // Use pravatar.cc for diverse avatar images (70 unique faces)
  const avatarNumber = (index % 70) + 1;
  return `https://i.pravatar.cc/300?img=${avatarNumber}`;
}
