// User model tests
// TODO: Expand with full testing framework

import { describe, it, expect, beforeAll } from '@jest/globals';
import User from '../models/user.js';

describe('User Model', () => {
  it('should have required methods', () => {
    const user = new User();
    expect(typeof user.matchPassword).toBe('function');
    expect(typeof user.isValidPassword).toBe('function');
  });

  it('should have timestamps enabled', () => {
    const user = new User({ email: 'test@example.com' });
    expect(user.schema.options.timestamps).toBe(true);
  });

  it('should have proper indexes defined', () => {
    const indexes = User.schema.indexes();
    const indexFields = indexes.map(index => Object.keys(index[0])[0]);
    
    expect(indexFields).toContain('email');
    expect(indexFields).toContain('spotify_id');
    expect(indexFields).toContain('likedUsers');
  });

  it('should have password field with select: false', () => {
    const passwordField = User.schema.path('password');
    expect(passwordField.options.select).toBe(false);
  });

  it('should have default values for certain fields', () => {
    const user = new User();
    expect(user.allowedAccess).toBe(false);
    expect(user.isEmailVerified).toBe(false);
    expect(user.pic).toBe("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
  });
});

// TODO: Add tests for:
// - Password hashing on save
// - matchPassword functionality
// - isValidPassword functionality
// - Unique constraints on email and spotify_id
// - Schema validation
