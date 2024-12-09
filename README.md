# Project Name

Auction House

## Overview

An auction website where users can add items to be bid on and bid on items other users have put up for auction. (This is semester project 2 at Noroff)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/project-name.git
```

2. Install dependencies:

```bash
cd project-name
npm install
```

## Running the Project Locally

1. To start the project, run:

```bash
npm start
```

2. Open your browser and go to `http://localhost:3000`.

## Manual Testing Instructions

1. **Start the application**:

   - Run the command `npm start` to launch the application locally.
   - The application should be accessible at [http://localhost:3000](http://localhost:3000) (or another port specified in your configuration).

2. **Test the following functionalities**:

- **User Registration**:
  - Navigate to `/auth/register/` (Sign up button on right top) and ensure you can register a new user.
  - Check that you receive a success message after registration.
- **User Login**:
  - Navigate to `/auth/login/` and ensure you can log in using the credentials you registered with.
  - Verify that the login page redirects you to the homepage (`/`) after successful login.
