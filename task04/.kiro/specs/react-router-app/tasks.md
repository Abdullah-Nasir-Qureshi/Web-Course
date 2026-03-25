# Implementation Plan

- [x] 1. Scaffold the React project and install dependencies
  - Initialize a new React app (Vite + React) and install `react-router-dom` and `fast-check`
  - _Requirements: 1.1, 1.2_

- [x] 2. Implement the Navbar and routing shell
  - [x] 2.1 Create the `Navbar` component with `NavLink` elements for Home, About, and Contact
    - _Requirements: 1.1_
  - [x] 2.2 Set up `App` with `BrowserRouter`, `Navbar`, and `Routes` including a catch-all redirect to "/"
    - _Requirements: 1.2, 1.3_
  - [ ]* 2.3 Write property test for navbar presence on all routes
    - **Property 1: Controlled input binding**
    - **Validates: Requirements 1.1**

- [x] 3. Implement page components
  - [x] 3.1 Create `Home` component with a welcome message
    - _Requirements: 2.1_
  - [x] 3.2 Create `About` component with a brief app description
    - _Requirements: 3.1_

- [x] 4. Implement the Contact form





  - [x] 4.1 Install test dependencies (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) and configure `vite.config.js` for testing


    - _Requirements: 4.1_
  - [x] 4.2 Create `Contact` component with controlled inputs for name, email, and message using `useState`


    - _Requirements: 4.1, 4.2_
  - [x] 4.3 Wire the `/contact` route into `App.jsx`


    - _Requirements: 4.1_
  - [x] 4.4 Add form submission handler that prevents default, logs data, and resets fields

    - _Requirements: 4.3, 4.4_
  - [x] 4.5 Add inline validation that blocks submission and shows messages when any field is empty

    - _Requirements: 4.5_
  - [ ]* 4.6 Write property test: controlled input binding
    - **Property 1: Controlled input binding**
    - **Validates: Requirements 4.2**
  - [ ]* 4.7 Write property test: form reset after submission
    - **Property 2: Form reset after submission**
    - **Validates: Requirements 4.4**
  - [ ]* 4.8 Write property test: empty field validation blocks submission
    - **Property 3: Empty field validation blocks submission**
    - **Validates: Requirements 4.5**




- [ ] 5. Checkpoint — Ensure all tests pass, ask the user if questions arise.
