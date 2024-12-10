# Project Name

Auction House

## Overview

An auction website where users can add items to be bid on and bid on items other users have put up for auction. (This is semester project 2 at Noroff)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/H-chai/Auction-semester-project.git
```

2. Install dependencies:

```bash
cd project-name
npm install
```

## Running the Project Locally

1. To start the project, run:

```bash
npm run dev
```

2. Open your browser and go to the port shown in the terminal.

## Manual Testing Instructions

1. **Start the application**:

   - Run the command `npm run dev` to launch the application locally.
   - The application should be accessible at the port shown in the terminal.

2. **Test the following functionalities**:

- **User Registration**:
  - Navigate to `/auth/register/` (`Sign up` button is located in the top right corner on desktop or can be accessed via the hamburger menu on mobile) and ensure you can register a new user.
  - Check that you receive a success message after registration and redirect to log in page (`/auth/login/`).
- **User Login**:
  - Navigate to `/auth/login/` (`Log in` button is located in the top right corner on desktop or can be accessed via the hamburger menu on mobile) and ensure you can log in using the credentials you registered with.
  - Verify that the login page redirects you to the homepage (`/?page=1`) after successful login.
- **Create Listing**:
  - Ensure that after logging in, you can navigate to `/listing/create/` (`Create Listing` button is located in the top right corner on desktop or can be accessed via icon `(+)` in footer on mobile.) and create a new listing.
  - Verify that the listing is displayed on the homepage (`/?page=1`).
- **Update Listing**:
  - Ensure that after logging in and create a listing.
  - Go to your listing page and you can navigate to `/listing/update/` (`Update Listing` button is located in the page if it is your own listing.)
  - Verify that the listing is updated on the listing page.
- **Delete Listing**:
  - Go to the `/listing/update/` page of the listing you wish to delete (`Update Listing` button is located in the page if it is your own listing).
  - Ensure that there is a `Delete Listing` button on the page. Click it to initiate the deletion process.
  - A confirmation message should appear asking if you're sure you want to delete the listing. Confirm the deletion.
  - After confirming the deletion, verify that the listing is no longer visible on the listing feed page (`/`) or on your profile page `/profile/`.
- **User Profile**:
  - Navigate to `/profile/` (Your avatar is located in the top right corner on desktop or the bottom right on mobile) and check that you can view your profile information.
  - Ensure that you can see your total credits on your profile page.
- **Update User Profile**:
  - Ensure you are on your profile page.
  - Ensure that there is a `Update Profile` button on the page. Click it to initiate updating process.
  - After clicking Update Profile button, verify that your profile is updated on your profile page `/profile/`.
- **Bid on Listings**:
  - Ensure you are on other user's listing page.
  - Ensure that you can bid on listing. A success message should appear after submitting your bidding (by clicking `Place a bid` button).
  - Verify that your current credits is updated.
- **Search Through Listings**:
  - Ensure you are on the homepage.
  - Ensure that you can search through listing by writing a keyword in search field.
  - Ensure that you get search result which matches with you search.
