- I want the project to use images using open source image websites, make sure that it is updated and working.
- make sure images are still appearing
- Make sure the project ui ux is great.
- i want comtok features to be working smooth
- this is a community based reddit type websites where people from the philippines can interact with their certain community and can talk about issues in their barangay, city, province, region, and the whole philippines. the region and province should already be given by system. but users can create their own cities and make sure it is a real city from the province and region. they can also create their barangay sub section.
- it will be formed as a tree formation where it will be region -> province -> city -> barangay
- use tailwind using **CDN**

- i want to use firebase for database
- use expressJs for backend

- create your own files based to what files are needed to complete the system, make sure the files creating will be base on what files are required and needed for other files to work perfectly
- it is reddit like website, but differnent design and still follows community base
  ComTok: Community-Based Mobile Application

🔹 Tools & Technologies

Frontend (React Native + Expo)

React Native (Expo) – For cross-platform mobile development

Tailwind CSS (CDN) – For modern styling

React Navigation – For screen navigation

Axios – For making API requests

Zustand/Redux – For state management

Backend (Express.js + Node.js)

Express.js – API framework

MySQL – Relational database

JWT – For user authentication

Socket.io – For real-time notifications

🔹 Project Overview

ComTok

A community-based, Reddit-like mobile application focused on the Philippines.

Provinces serve as main sections.

Cities within those provinces are subtopics.

Users can post content, upvote/downvote, comment, and join communities.

UI/UX should be modern and user-friendly.

Make sure UI and Styles respond to Light and Darkmode colors

It is mobile-only.

Always check for errors and fix it

Make sure everything works with Database

🔹 Application Features

1️⃣ User Authentication

Users can sign up, log in, and manage profiles.

Authentication is handled using JWT.

Users can upload profile pictures.

2️⃣ Community Structure

Provinces act as main sections.

Cities within provinces serve as subtopics.

Users can explore, join, and participate in discussions in their preferred locations.

3️⃣ Posting & Engagement

Users can create text, image, or link-based posts.

Posts are categorized based on the selected province and city.

Users can upvote/downvote posts and comment on discussions.

4️⃣ Real-Time Interactions

Users receive live notifications for replies, upvotes, and new posts in their communities.

Implement real-time updates for posts and comments using Socket.io.

5️⃣ Moderation & Reporting

Users can report inappropriate posts/comments.

Admins or moderators can review and take action on reported content.

6️⃣ Search & Discovery

Users can search for communities, posts, or specific discussions.

Popular and trending posts appear on the home screen.

7️⃣ Personalization & User Experience

Users can follow specific provinces and cities to customize their feed.

Dark mode support for better accessibility.

🔹 Backend API Features

User Management: Handles authentication, profile updates, and user settings.

Post Management: Enables creating, editing, deleting, and fetching posts by province/city.

Comment System: Allows users to engage in discussions under posts.

Voting System: Implements upvotes and downvotes for ranking content.

Notification System: Provides real-time updates on new interactions.

🔹 Frontend UI/UX Considerations

Home Screen: Displays trending and recommended posts.

Navigation: Easy access to provinces, cities, and user profiles.

Post Creation Page: Simple and intuitive UI for posting content.

Profile Page: Shows user information, posts, and saved content.

# Required Dependencies for ComTok

This document outlines all the essential dependencies required to run the ComTok application successfully.

## Core Dependencies

### Frontend (React Native/Expo)

| Package                                     | Version  | Purpose                                       |
| ------------------------------------------- | -------- | --------------------------------------------- |
| `expo`                                      | ^52.0.40 | Core Expo framework                           |
| `react`                                     | 18.3.1   | Core React library                            |
| `react-native`                              | 0.76.7   | React Native framework                        |
| `expo-router`                               | ~4.0.19  | File-based routing for Expo apps              |
| `expo-secure-store`                         | ~14.0.1  | Secure storage for authentication tokens      |
| `expo-local-authentication`                 | ~15.0.2  | Biometric authentication (Face ID / Touch ID) |
| `@react-native-async-storage/async-storage` | 1.23.1   | Persistent storage solution                   |
| `axios`                                     | ^1.8.4   | API requests and data fetching                |

### Backend (Node.js/Express)

| Package        | Version | Purpose                         |
| -------------- | ------- | ------------------------------- |
| `express`      | ^4.21.2 | Web server framework            |
| `sequelize`    | ^6.37.6 | ORM for database interactions   |
| `mysql2`       | ^3.14.0 | MySQL database driver           |
| `jsonwebtoken` | ^9.0.2  | JWT authentication              |
| `bcryptjs`     | ^3.0.2  | Password hashing                |
| `cors`         | ^2.8.5  | Cross-origin resource sharing   |
| `dotenv`       | ^16.4.7 | Environment variable management |

## Installation

To ensure you have all required dependencies installed, run:

```bash
npm run setup
```

This will install both frontend and backend dependencies.

## Troubleshooting Missing Dependencies

If you encounter module resolution errors:

1. For frontend packages:

   ```bash
   npm run install-packages
   ```

2. For backend packages:

   ```bash
   npm run install-backend
   ```

3. If specific packages are still missing, install them manually:
   ```bash
   npm install package-name
   ```

## Environment Setup

Make sure to set up your environment variables in a `.env` file:
