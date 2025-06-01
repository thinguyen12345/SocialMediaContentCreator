Social Media Content Generator

This is a web application for generating social media content ideas and captions using AI, built with React, Express, Firebase, Twilio, and Gemini AI.
Project Structure

Frontend: React application (src/) with components for login, dashboard, services, and profile.
Backend: Express server (server.js) handling API requests, Firebase integration, Twilio SMS, and Gemini AI content generation.
Database: Firebase Firestore for storing access codes and user-generated content.
Environment: .env file for sensitive configuration.

Prerequisites

Node.js (v16 or higher)
Firebase account with Firestore enabled
Twilio account for SMS functionality
Google Gemini AI API key

Setup Instructions

Clone the Repository
git clone : https://github.com/thinguyen12345/SocialMediaContentCreator
cd social-media-content-generator

Frontend Setup
cd client
npm install
npm run dev

Installs dependencies and starts the Vite development server (runs on http://localhost:5173).

Backend Setup
cd ../server
npm install

Create a .env file in the server directory with the variables listed in .env artifact.
Run the server:node server.js

Server runs on http://localhost:3001.

Firebase Configuration

Create a Firebase project and enable Firestore.
Download the service account key and update .env with FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL.

Twilio Configuration

Sign up for Twilio and obtain TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and a Twilio phone number.
Update .env with these values.

Gemini AI Configuration

Obtain a Gemini AI API key from Google and add it to .env as GEMINI_API_KEY.

Running the Application

Start the backend server (node server.js).
Start the frontend development server (npm run dev in client directory).
Open http://localhost:5173 in your browser.
Enter a phone number to receive an access code via SMS, validate the code, and access the dashboard.

Features

Login: Phone number-based authentication with SMS access code validation.
Dashboard: Tabs for "Services" (content generation) and "Profile" (saved content).
Services:
Generate captions for Facebook, Instagram, or Twitter based on topic and tone.
Generate post ideas for a given topic and create captions from selected ideas.
Save captions to Firebase and share via Facebook or email (simulated).


Profile: View, unsave, and share saved captions.

Screenshots

Login Screen: login.png
Dashboard (Services): services.png
Dashboard (Profile): profile.png

Notes

Sharing functionality is simulated (alerts) due to sandboxed environment constraints. In a production setting, integrate Facebook SDK or email client.
The application uses Tailwind CSS for styling, providing a clean and responsive UI.

Submission

Public GitHub repository: https://github.com/thinguyen12345/SocialMediaContentCreator
Emails sent to: thinguyen123@gmail.com



