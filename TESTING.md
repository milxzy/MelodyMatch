# Testing Documentation

## Overview

MelodyMatch uses a comprehensive testing strategy to ensure code quality and reliability.

## Testing Stack

### Backend
- **Jest**: Test framework
- **Supertest**: API endpoint testing
- **Coverage target**: 40%+ for MVP, 70%+ for production

### Frontend
- **Vitest**: Fast test runner for Vite projects
- **React Testing Library**: Component testing
- **@testing-library/jest-dom**: Custom Jest matchers
- **jsdom**: DOM environment for tests

## Running Tests

### Backend Tests
```bash
cd server
npm test                 # Run all tests with coverage
npm run test:watch       # Run tests in watch mode
```

### Frontend Tests
```bash
cd client
npm test                 # Run all tests with coverage
npm run test:watch       # Run tests in watch mode
```

## Test Structure

### Backend Tests (`server/tests/`)
- `auth.test.js` - Authentication flow tests
- `matching.test.js` - Matching algorithm tests
- `api.test.js` - API endpoint tests
- `socket.test.js` - Socket.io real-time features
- `user.model.test.js` - User model validation
- `security.test.js` - Security middleware tests

### Frontend Tests (`client/src/tests/`)
- `Dashboard.test.jsx` - Dashboard component
- `setup.js` - Test environment configuration

## Test Coverage Goals

### Phase 1 (Current - Week 2)
- ✅ Test infrastructure setup
- ✅ Test stubs for all major features
- 🎯 Target: 40% coverage on critical paths

### Phase 2 (Weeks 3-4)
- Implement all test stubs
- Add integration tests
- 🎯 Target: 60% coverage

### Phase 3 (Weeks 5-6)
- Add E2E tests
- Edge case coverage
- 🎯 Target: 70%+ coverage

## Writing Tests

### Backend Test Example
```javascript
describe('User Registration', () => {
  it('should hash password before saving', async () => {
    const user = new User({ 
      email: 'test@example.com', 
      password: 'plain123' 
    });
    await user.save();
    expect(user.password).not.toBe('plain123');
  });
});
```

### Frontend Test Example
```javascript
describe('Login Component', () => {
  it('should render login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
```

## TODO

- [ ] Implement all test stubs
- [ ] Set up test database for integration tests
- [ ] Add E2E testing with Playwright/Cypress
- [ ] Set up CI/CD to run tests on every PR
- [ ] Add test coverage reporting to PRs
- [ ] Implement mock Spotify API for tests

## Notes

- Tests use `NODE_ENV=test` for backend
- Frontend tests run in jsdom environment
- Mock data should be representative of production data
- Test files should be co-located with source files in future refactor
