# GymPAPPa Testing Documentation

## 1. Testing objectives

The goal of this testing pass was to verify the actual, final GymPAPPa implementation without inventing functionality or claiming results that were not executed. The test suite focuses on the features that are implemented in the codebase and on areas that are critical to the system: authentication, authorization, equipment management, court/crowd updates, event utility logic, and key frontend flow validation.

## 2. Testing strategy

- Backend unit and integration checks for auth, authorization, and request validation logic
- Frontend component checks for the login form and app routing behavior
- Real execution of the suite in the actual workspace, not mocked assumptions
- Bug-fix verification using a failing test before code change, followed by re-run after the fix

## 3. Testing tools and frameworks

### Backend
- Node.js built-in test runner (`node:test`)
- Native assert module
- Express + PostgreSQL code paths exercised through isolated controller logic tests

### Frontend
- Vitest
- React Testing Library
- jsdom
- @testing-library/jest-dom
- Coverage plugin: `@vitest/coverage-v8`

## 4. Testing environment

- Backend project: `code/backend`
- Frontend project: `code/frontend`
- Database: PostgreSQL connection configured through `code/backend/utils/database.js`
- Frontend dev server uses Vite proxy to `http://localhost:5000`
- JWT secret is read from the backend `.env` file and used by `jwtUtils.js`

## 5. Test categories covered

- Authentication flow validation
- Authorization checks for role-based access
- Equipment request validation
- Court status normalization logic
- Event payload normalization and expiry checks
- Login form validation
- Protected/public route behavior in the React app

## 6. Test cases implemented

### Backend tests
- Valid JWT accepted and user role attached
- Missing/invalid token rejected
- Role-based authorization denial works
- Login rejects empty credentials and unknown users
- Equipment request rejects invalid quantity values
- Equipment request accepts valid input
- Court status block values are normalized to the DB state
- Event utilities parse payloads and flag expired events correctly

### Frontend tests
- Empty login form triggers validation feedback
- Successful login stores session data and calls the login API
- Unauthenticated app route redirects to the login page

## 7. API testing notes

The project includes several API route groups:

- `/api/auth`
- `/api/equipment`
- `/api/manage`
- `/api/admin`
- `/api/partner-finder`
- `/api/courts`
- `/api/events`

The testing pass focused on implemented flows that are meaningful and executable, rather than inventing endpoints or unimplemented behavior.

## 8. Database testing notes

The project uses PostgreSQL with a schema defined in `code/database/init.sql`. The backend tests validate logic at the controller layer and database interaction boundary without deleting or corrupting the development database. The real DB was not reset or destroyed during testing.

## 9. Frontend testing notes

The frontend is a Vite React application with route guards in `src/App.jsx`. The tested behavior reflects actual form handling and session-state logic implemented in the code, rather than hypothetical UX flows.

## 10. Bug fixing evidence

### Bug ID: BE-001

- Feature: Equipment request validation
- Problem: A request with `quantity = 0` was incorrectly treated as “missing required input” instead of invalid quantity.
- Steps to reproduce: call `requestEquipment` with `equipment_id`, `studentId`, `pickupTime`, and `quantity: 0`.
- Expected result: `400` with message `quantity must be a positive integer`.
- Actual result before fix: `400` with message `studentId, equipment_id, quantity and pickupTime are required`.
- Root cause: the controller checked `!quantity` before validating integer positivity, so zero fell into the missing-field guard.
- Fix: changed the required-field guard to only reject undefined/null/empty values, and kept integer positivity validation separate.
- Verification: backend test suite re-run and passed after the fix.

## 11. Test execution results

### Backend
- Command: `Set-Location 'f:\Projects\gympappa-fresh\code\backend'; npm test -- --test-reporter=spec`
- Result: 11 tests passed, 0 failed

- Command: `Set-Location 'f:\Projects\gympappa-fresh\code\backend'; npm run coverage -- --test-reporter=spec`
- Result: 11 tests passed, 0 failed
- Coverage summary:
  - All files: 33.74% statements
  - Branches: 50.53%
  - Functions: 42.11%
  - Lines: 33.74%

### Frontend
- Command: `Set-Location 'f:\Projects\gympappa-fresh\code\frontend'; npm test -- --reporter=basic`
- Result: 3 tests passed, 0 failed

- Command: `Set-Location 'f:\Projects\gympappa-fresh\code\frontend'; npm run coverage -- --reporter=basic`
- Result: 3 tests passed, 0 failed
- Coverage summary:
  - All files: 22.80% statements
  - Branches: 61.76%
  - Functions: 7.29%
  - Lines: 22.80%

## 12. Manual Testing Results

In addition to automated testing, manual functional testing was performed on the final running GymPAPPa system using the browser interface, backend services, and configured database environment.

A total of 14 documented manual test scenarios were executed.

### Manual testing areas

- Student authentication
- Invalid login handling
- Protected route access
- Equipment request submission
- Equipment request validation
- Court status management
- Crowd level management
- Partner request creation
- Partner join workflow
- Administrator role management
- Equipment issue by counter staff
- Equipment return by counter staff
- Administrator event creation
- Event persistence and listing

### Results

- Total documented manual scenarios: 14
- Passed: 14
- Failed: 0

Detailed test procedures, expected results, actual results, statuses, and screenshot evidence are provided in the separate:

`GymPAPPa Manual Testing Report`

## 13. Known limitations

- The test suite covers a focused set of implemented behaviors rather than every single UI page or every backend endpoint.
- Some large front-end pages remain untested because the project is substantial and the goal was to validate meaningful flows without over-specifying tests.
- The backend coverage is still relatively low because a large portion of the application is not yet targeted by automated tests.
- The project relies on a live PostgreSQL database and local Firebase configuration; tests were kept realistic and did not delete or mutate production/dev data.

