import { describe, it, expect } from '@jest/globals';
import { calculateCompatibility } from '../utils/matchingAlgorithm.js';

describe('Matching Algorithm', () => {
  describe('Genre Similarity', () => {
    it('should return 100% for identical genres', () => {
      const user1 = { genres: ['pop', 'rock', 'indie'] };
      const user2 = { genres: ['pop', 'rock', 'indie'] };
      
      const score = calculateCompatibility(user1, user2);
      expect(score).toBe(100);
    });

    it('should return 0% for no genre overlap', () => {
      const user1 = { genres: ['pop', 'rock'], artists: [] };
      const user2 = { genres: ['classical', 'jazz'], artists: [] };
      
      const score = calculateCompatibility(user1, user2);
      expect(score).toBe(0);
    });

    it('should calculate partial genre overlap correctly', () => {
      const user1 = { genres: ['pop', 'rock', 'indie', 'electronic'], artists: [] };
      const user2 = { genres: ['pop', 'rock', 'jazz', 'blues'], artists: [] };
      
      // 2 genres in common out of 6 unique = 33.33%
      // Genre weight is 60%, so score should be around 20%
      const score = calculateCompatibility(user1, user2);
      expect(score).toBeGreaterThan(15);
      expect(score).toBeLessThan(25);
    });
  });

  describe('Artist Similarity', () => {
    it('should return 100% for identical artists', () => {
      const user1 = { 
        genres: [], 
        artists: ['Taylor Swift', 'The Weeknd', 'Drake'] 
      };
      const user2 = { 
        genres: [], 
        artists: ['Taylor Swift', 'The Weeknd', 'Drake'] 
      };
      
      const score = calculateCompatibility(user1, user2);
      expect(score).toBe(100);
    });

    it('should return 0% for no artist overlap', () => {
      const user1 = { genres: [], artists: ['Artist A', 'Artist B'] };
      const user2 = { genres: [], artists: ['Artist C', 'Artist D'] };
      
      const score = calculateCompatibility(user1, user2);
      expect(score).toBe(0);
    });

    it('should handle case-insensitive artist matching', () => {
      const user1 = { genres: [], artists: ['taylor swift'] };
      const user2 = { genres: [], artists: ['Taylor Swift'] };
      
      const score = calculateCompatibility(user1, user2);
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('Overall Compatibility', () => {
    it('should weight genres at 60% and artists at 40%', () => {
      // Perfect genre match, no artist match
      const user1 = { 
        genres: ['pop'], 
        artists: ['Artist A'] 
      };
      const user2 = { 
        genres: ['pop'], 
        artists: ['Artist B'] 
      };
      
      const score = calculateCompatibility(user1, user2);
      // Should be around 60% (100% genres * 0.6 + 0% artists * 0.4)
      expect(score).toBeGreaterThan(55);
      expect(score).toBeLessThan(65);
    });

    it('should handle empty profiles gracefully', () => {
      const user1 = { genres: [], artists: [] };
      const user2 = { genres: ['pop'], artists: ['Artist A'] };
      
      const score = calculateCompatibility(user1, user2);
      expect(score).toBe(0);
    });

    it('should handle undefined genres/artists', () => {
      const user1 = {};
      const user2 = { genres: ['pop'], artists: ['Artist A'] };
      
      expect(() => calculateCompatibility(user1, user2)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large lists', () => {
      const largeGenreList = Array(100).fill(null).map((_, i) => `genre${i}`);
      const user1 = { genres: largeGenreList, artists: [] };
      const user2 = { genres: largeGenreList.slice(50), artists: [] };
      
      const score = calculateCompatibility(user1, user2);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(100);
    });

    it('should handle special characters in names', () => {
      const user1 = { genres: [], artists: ['AC/DC', '$uicideboy$'] };
      const user2 = { genres: [], artists: ['AC/DC', 'Artist B'] };
      
      expect(() => calculateCompatibility(user1, user2)).not.toThrow();
    });
  });
});
