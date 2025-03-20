# Testing

## overview

MelodyMatch uses Jest for backend testing and Vitest for frontend testing.

## running tests

### backend

```bash
cd server
npm test              # run tests with coverage
npm run test:watch    # watch mode
```

### frontend

```bash
cd client
npm test              # run tests with coverage
npm run test:watch    # watch mode
```

## current test coverage

### backend (`server/tests/`)

- `matching.test.js` — **10 tests** for the core matching algorithm (genre/artist compatibility scoring, jaccard coefficient, edge cases)

### frontend (`client/src/tests/`)

- Coverage coming with upcoming feature work

## writing tests

### backend example

```javascript
describe('Matching Algorithm', () => {
  it('should return 1.0 for identical music taste', () => {
    const score = calculateCompatibility(userA, userB);
    expect(score).toBe(1.0);
  });
});
```

### frontend example

```javascript
describe('Login Component', () => {
  it('should render login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
```

## notes

- Backend tests use `NODE_ENV=test`
- Frontend tests run in a jsdom environment
- CI runs tests on every push and pull request via GitHub Actions
