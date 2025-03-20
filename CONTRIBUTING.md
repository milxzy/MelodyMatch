# Contributing to MelodyMatch

Thanks for your interest in contributing!

## getting started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/MelodyMatch.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Set up your environment following the instructions in [README.md](./README.md)

## opening issues

- For bugs, include steps to reproduce, expected behavior, and actual behavior
- For features, open an issue first to discuss before starting work
- For large changes, always open an issue before submitting a PR

## pull requests

- Keep PRs focused — one feature or fix per PR
- Write clear commit messages
- Make sure existing tests still pass: `cd server && npm test`
- Add tests for new functionality if applicable
- Update relevant documentation

## code style

- The project uses ESLint and Prettier — run `npm run lint` before submitting
- Server-side logging uses Winston — don't add `console.log` statements
- Follow the existing patterns in the codebase

## questions

Open an issue and tag it with `question`.
