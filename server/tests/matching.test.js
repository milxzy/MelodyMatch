import { describe, it, expect } from '@jest/globals';
import { calculateMusicCompatibility } from '../utils/matchingAlgorithm.js';

// Helper to get the numeric percentage from the compatibility result object
const score = (u1, u2) => calculateMusicCompatibility(u1, u2).percentage;

describe('Matching Algorithm', () => {
  describe('Genre Similarity', () => {
    it('should return 100% for identical genres', () => {
      const user1 = { genres: ['pop', 'rock', 'indie'] };
      const user2 = { genres: ['pop', 'rock', 'indie'] };

      expect(score(user1, user2)).toBe(60); // 100% genre * 0.6 weight, no artists
    });

    it('should return 0% for no genre overlap', () => {
      const user1 = { genres: ['pop', 'rock'], artists: [] };
      const user2 = { genres: ['classical', 'jazz'], artists: [] };

      expect(score(user1, user2)).toBe(0);
    });

    it('should calculate partial genre overlap correctly', () => {
      const user1 = { genres: ['pop', 'rock', 'indie', 'electronic'], artists: [] };
      const user2 = { genres: ['pop', 'rock', 'jazz', 'blues'], artists: [] };

      // 2 genres in common out of 6 unique = 33.33%
      // Genre weight is 60%, so percentage should be around 20%
      const result = score(user1, user2);
      expect(result).toBeGreaterThan(15);
      expect(result).toBeLessThan(25);
    });
  });

  describe('Artist Similarity', () => {
    it('should return 40% for identical artists with no genres', () => {
      const user1 = { genres: [], artists: ['Taylor Swift', 'The Weeknd', 'Drake'] };
      const user2 = { genres: [], artists: ['Taylor Swift', 'The Weeknd', 'Drake'] };

      // 100% artist match * 0.4 weight = 40%
      expect(score(user1, user2)).toBe(40);
    });

    it('should return 0% for no artist overlap', () => {
      const user1 = { genres: [], artists: ['Artist A', 'Artist B'] };
      const user2 = { genres: [], artists: ['Artist C', 'Artist D'] };

      expect(score(user1, user2)).toBe(0);
    });

    it('should handle case-insensitive artist matching', () => {
      const user1 = { genres: [], artists: ['taylor swift'] };
      const user2 = { genres: [], artists: ['Taylor Swift'] };

      expect(score(user1, user2)).toBeGreaterThan(0);
    });
  });

  describe('Overall Compatibility', () => {
    it('should weight genres at 60% and artists at 40%', () => {
      // Perfect genre match, no artist match
      const user1 = { genres: ['pop'], artists: ['Artist A'] };
      const user2 = { genres: ['pop'], artists: ['Artist B'] };

      // 100% genres * 0.6 + 0% artists * 0.4 = 60%
      const result = score(user1, user2);
      expect(result).toBeGreaterThan(55);
      expect(result).toBeLessThan(65);
    });

    it('should return 100% for perfect match on both genres and artists', () => {
      const user1 = { genres: ['pop', 'rock'], artists: ['Artist A', 'Artist B'] };
      const user2 = { genres: ['pop', 'rock'], artists: ['Artist A', 'Artist B'] };

      expect(score(user1, user2)).toBe(100);
    });

    it('should handle empty profiles gracefully', () => {
      const user1 = { genres: [], artists: [] };
      const user2 = { genres: ['pop'], artists: ['Artist A'] };

      expect(score(user1, user2)).toBe(0);
    });

    it('should handle undefined genres/artists', () => {
      const user1 = {};
      const user2 = { genres: ['pop'], artists: ['Artist A'] };

      expect(() => calculateMusicCompatibility(user1, user2)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large lists', () => {
      const largeGenreList = Array(100).fill(null).map((_, i) => `genre${i}`);
      const user1 = { genres: largeGenreList, artists: [] };
      const user2 = { genres: largeGenreList.slice(50), artists: [] };

      const result = score(user1, user2);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(100);
    });

    it('should handle special characters in names', () => {
      const user1 = { genres: [], artists: ['AC/DC', '$uicideboy$'] };
      const user2 = { genres: [], artists: ['AC/DC', 'Artist B'] };

      expect(() => calculateMusicCompatibility(user1, user2)).not.toThrow();
    });
  });
});
