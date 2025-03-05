// Demographic data for generating realistic bot users

export const firstNames = {
  male: [
    'Liam', 'Noah', 'Oliver', 'James', 'Ethan', 'Lucas', 'Mason', 'Logan',
    'Alexander', 'Michael', 'Benjamin', 'William', 'Daniel', 'Matthew', 'Henry',
    'Jackson', 'Sebastian', 'Jack', 'Aiden', 'Owen', 'Samuel', 'David',
    'Joseph', 'Carter', 'Wyatt', 'John', 'Luke', 'Dylan', 'Grayson', 'Isaac'
  ],
  female: [
    'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia',
    'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery',
    'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Riley', 'Aria',
    'Lily', 'Aubrey', 'Zoey', 'Penelope', 'Hannah', 'Layla', 'Nora', 'Madison'
  ],
  'non-binary': [
    'Alex', 'Jordan', 'Casey', 'Taylor', 'Riley', 'Morgan', 'Avery', 'Quinn',
    'Sage', 'River', 'Rowan', 'Charlie', 'Skylar', 'Parker', 'Drew', 'Kai',
    'Phoenix', 'Reese', 'Cameron', 'Dakota', 'Finley', 'Emerson', 'Blake',
    'Hayden', 'Jamie', 'Elliot', 'Robin', 'Stevie', 'Frankie', 'Ash'
  ]
};

export const lastNames = [
  // Common English surnames
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White',
  'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Hall',
  
  // Diverse cultural surnames
  'Chen', 'Wang', 'Li', 'Kim', 'Park', 'Nguyen', 'Patel', 'Singh', 'Kumar',
  'Khan', 'Ali', 'Ahmed', 'Hassan', 'Yamamoto', 'Tanaka', 'Sato', 'Silva',
  'Santos', 'Costa', 'Ferreira', 'O\'Brien', 'Murphy', 'Kelly', 'Ryan',
  'Schmidt', 'Müller', 'Schneider', 'Fischer', 'Weber', 'Meyer'
];

export const genders = ['male', 'female', 'non-binary'];

// Age distribution matching dating app demographics
export const ageDistribution = [
  { min: 18, max: 24, weight: 40 },  // 40% of users
  { min: 25, max: 30, weight: 35 },  // 35% of users
  { min: 31, max: 40, weight: 20 },  // 20% of users
  { min: 41, max: 45, weight: 5 }    // 5% of users
];

// Country distribution
export const countries = [
  { code: 'US', name: 'United States', weight: 60 },
  { code: 'CA', name: 'Canada', weight: 10 },
  { code: 'GB', name: 'United Kingdom', weight: 10 },
  { code: 'AU', name: 'Australia', weight: 10 },
  { code: 'DE', name: 'Germany', weight: 2 },
  { code: 'FR', name: 'France', weight: 2 },
  { code: 'ES', name: 'Spain', weight: 2 },
  { code: 'BR', name: 'Brazil', weight: 2 },
  { code: 'MX', name: 'Mexico', weight: 1 },
  { code: 'JP', name: 'Japan', weight: 1 }
];

// Helper functions

export function getRandomGender() {
  return genders[Math.floor(Math.random() * genders.length)];
}

export function getRandomFirstName(gender) {
  const names = firstNames[gender] || firstNames['non-binary'];
  return names[Math.floor(Math.random() * names.length)];
}

export function getRandomLastName() {
  return lastNames[Math.floor(Math.random() * lastNames.length)];
}

export function getRandomFullName(gender) {
  const firstName = getRandomFirstName(gender);
  const lastName = getRandomLastName();
  return `${firstName} ${lastName}`;
}

export function getRandomAge() {
  // Calculate total weight
  const totalWeight = ageDistribution.reduce((sum, range) => sum + range.weight, 0);
  let random = Math.random() * totalWeight;
  
  // Select age range based on weight
  for (const range of ageDistribution) {
    random -= range.weight;
    if (random <= 0) {
      // Return random age within selected range
      return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }
  }
  
  return 25; // fallback
}

export function getRandomCountry() {
  const totalWeight = countries.reduce((sum, country) => sum + country.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const country of countries) {
    random -= country.weight;
    if (random <= 0) {
      return country.code;
    }
  }
  
  return 'US'; // fallback
}

// Generate complete demographic profile
export function generateDemographicProfile() {
  const gender = getRandomGender();
  return {
    name: getRandomFullName(gender),
    gender,
    age: String(getRandomAge()),
    country: getRandomCountry()
  };
}
