// Bio generation for bot users

const bioTemplates = [
  // Music-focused bios
  "Music is my therapy 🎵 Always down to discover new artists and share playlists",
  "Concert junkie 🎸 If you've got good music taste, we'll vibe",
  "Living life one song at a time. Let's find our perfect duet 🎶",
  "Music lover looking for someone to share aux cord privileges with 🚗🎵",
  "Vinyl collector and melody enthusiast. Let's talk about our favorite albums 💿",
  "Dancing through life with headphones on 🎧 What's on your playlist?",
  "Genre fluid - from jazz to indie to hip hop. Music has no boundaries ✨",
  "Looking for someone who gets why I cry during certain songs 😅🎵",
  "Let's make a playlist together and see if we match 🎶",
  "Music festival season is my favorite season 🎪 Who wants to join?",
  
  // Personality-focused with music
  "Spontaneous road trips + good music = perfect day 🚗🎵",
  "Coffee addict ☕ Music lover 🎵 Adventure seeker ✈️",
  "Introverted but music brings me alive. Let's vibe together 🎧",
  "Dog lover 🐕 Concert goer 🎸 Taco enthusiast 🌮",
  "Hopeless romantic with a killer playlist 💕🎵",
  "Sarcasm is my love language. Good music is my religion 🎶",
  "Aspiring photographer 📸 Full-time music lover 🎵",
  "Bookworm by day, concert goer by night 📚🎸",
  "Trying to find someone who appreciates my obscure music references 😄",
  "Foodie + Music = My whole personality 🍕🎵",
  
  // Simple and direct
  "Here for genuine connections and great conversations about music 🎵",
  "Let's skip the small talk and talk about our favorite songs instead",
  "Not here for games. Just looking for someone with good vibes and great taste 🎶",
  "Swipe right if you know the words to our generation's anthems 🎤",
  "Looking for my concert buddy and maybe more 🎸💕",
  "Music taste says a lot about a person. What does yours say? 🎵",
  "If we match on music, we'll probably match on everything else ✨",
  "Let's see if our playlists are compatible 🎧",
  "Down to earth, music obsessed, looking for the same 🌍🎵",
  "Shower singer looking for a duet partner 🚿🎤",
  
  // Creative/quirky
  "I judge people by their Spotify wrapped 😅 Show me yours?",
  "My love language is making you a playlist 💕🎵",
  "Warning: Will randomly break into song 🎤 Can you handle it?",
  "Collecting vinyl and memories. Want to be part of my collection? 💿✨",
  "My aux cord, my rules 🎵 (but I'm open to recommendations)",
  "Professional concert screamer 🎸 Amateur life navigator 😅",
  "I speak fluent lyrics. Test me 🎵",
  "Looking for someone who won't judge my guilty pleasure songs 🙈🎶",
  "Music snob with a soft heart. Balance is key ⚖️🎵",
  "Let's make our own soundtrack together 🎬🎵"
];

const musicInterests = [
  "live music", "vinyl collecting", "discovering new artists", "making playlists",
  "music festivals", "concert photography", "karaoke nights", "DJ sets",
  "bedroom pop", "underground shows", "record stores", "acoustic sessions",
  "late night drives with music", "song lyrics", "music theory", "album art"
];

const hobbies = [
  "photography", "hiking", "cooking", "reading", "yoga", "gaming",
  "painting", "writing", "traveling", "skateboarding", "surfing", "dancing",
  "fitness", "meditation", "coffee tasting", "craft beer", "foodie adventures",
  "movie marathons", "podcasts", "stargazing", "thrifting", "plant parenting"
];

/**
 * Generate a bio for a bot user
 * @param {object} demographics - User demographics (name, age, gender, country)
 * @param {object} music - User music preferences (genres, artists)
 * @returns {string} Generated bio
 */
export function generateBio(demographics, music) {
  // 70% chance of using a template, 30% chance of custom bio
  if (Math.random() < 0.7) {
    return bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
  }
  
  // Generate custom bio
  const parts = [];
  
  // Add age reference (20% chance)
  if (Math.random() < 0.2) {
    parts.push(`${demographics.age} year old`);
  }
  
  // Add music genre reference (60% chance)
  if (Math.random() < 0.6 && music.genres.length > 0) {
    const genreCount = Math.random() < 0.5 ? 1 : 2;
    const selectedGenres = music.genres.slice(0, genreCount);
    parts.push(`${selectedGenres.join(' & ')} enthusiast`);
  }
  
  // Add music interest (50% chance)
  if (Math.random() < 0.5) {
    const interest = musicInterests[Math.floor(Math.random() * musicInterests.length)];
    parts.push(`into ${interest}`);
  }
  
  // Add hobby (40% chance)
  if (Math.random() < 0.4) {
    const hobby = hobbies[Math.floor(Math.random() * hobbies.length)];
    parts.push(`love ${hobby}`);
  }
  
  // Add location reference (30% chance)
  if (Math.random() < 0.3 && demographics.country) {
    parts.push(`based in ${demographics.country}`);
  }
  
  // Construct bio
  let bio = parts.join('. ');
  if (bio) {
    bio = bio.charAt(0).toUpperCase() + bio.slice(1);
    if (!bio.endsWith('.')) bio += '.';
    
    // Add a call to action (50% chance)
    if (Math.random() < 0.5) {
      const ctas = [
        " Let's connect! 🎵",
        " Swipe right if you vibe with this 😊",
        " Looking for genuine connections ✨",
        " Let's share our favorite songs 🎶",
        " Music brings us together 💕"
      ];
      bio += ctas[Math.floor(Math.random() * ctas.length)];
    }
  } else {
    // Fallback to template if custom generation fails
    bio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
  }
  
  return bio;
}

/**
 * Generate multiple HD profile pictures for a user
 * @param {number} index - User index
 * @param {string} gender - User gender
 * @returns {string[]} Array of HD picture URLs (3-5 pictures)
 */
export function generateMultiplePictures(index, gender) {
  const pictureCount = Math.floor(Math.random() * 3) + 3; // 3-5 pictures
  const pictures = [];
  
  // Use HD image sources
  const services = [
    // Pravatar - 1000px HD images
    (idx, g) => `https://i.pravatar.cc/1000?img=${idx}`,
    
    // Unsplash - HD random portraits (1200x1200)
    (idx, g) => {
      const collections = {
        male: 'man,portrait',
        female: 'woman,portrait',
        'non-binary': 'person,portrait'
      };
      const collection = collections[g] || 'person,portrait';
      return `https://source.unsplash.com/1200x1200/?${collection}&sig=${idx}`;
    },
    
    // Pexels API - HD stock photos (would need API key for production)
    // Using Unsplash as alternative for now
    (idx, g) => {
      const seed = idx * 7 + 100;
      const collections = {
        male: 'man,face',
        female: 'woman,face',
        'non-binary': 'person,face'
      };
      const collection = collections[g] || 'person,face';
      return `https://source.unsplash.com/1200x1200/?${collection}&sig=${seed}`;
    },
    
    // This Person Does Not Exist - AI generated HD faces (1024x1024)
    (idx, g) => `https://thispersondoesnotexist.com/?${idx}`,
    
    // Picsum with faces - HD images
    (idx, g) => `https://picsum.photos/seed/${idx}/1200/1200`
  ];
  
  for (let i = 0; i < pictureCount; i++) {
    const serviceIndex = (index + i) % services.length;
    const service = services[serviceIndex];
    pictures.push(service(index + i, gender));
  }
  
  return pictures;
}
