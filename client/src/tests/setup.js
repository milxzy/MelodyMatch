/* global process */
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
if (typeof process !== 'undefined') {
  process.env.VITE_API_URL = 'http://localhost:4000';
  process.env.VITE_SPOTIFY_CLIENT_ID = 'test_client_id';
}
