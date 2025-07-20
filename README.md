# StudySync

## Project Description
StudySync is a collaborative study platform for university students. It allows users to create and join study rooms, share flashcards, take quizzes, and track their learning progress. The platform is designed to foster real-time collaboration and make studying more interactive and effective.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn
- MongoDB (local or cloud instance)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd studySync
```

### 2. Install Dependencies
```bash
cd client
npm install
cd ../server
npm install
```

### 3. Configure Environment Variables
- Create a `.env` file in both `client/` and `server/` directories.
- For the client, set the backend API URL:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  ```
- For the server, set your MongoDB URI and any other required variables:
  ```env
  MONGODB_URI=mongodb://localhost:27017/studysync
  PORT=5000
  ```

### 4. Run the Application
- Start the backend:
  ```bash
  cd server
  npm start
  ```
- Start the frontend:
  ```bash
  cd client
  npm run dev
  ```
- Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Deployed Application
[Live Demo](<your-vercel-or-other-deployment-link>)

## Video Demonstration
[Watch the 5-10 minute demo](<your-youtube-or-video-link>)

## Screenshots

### Dashboard
![Dashboard Screenshot](screenshots/dashboard.png)

### Study Room
![Study Room Screenshot](screenshots/study-room.png)

### Quiz Page
![Quiz Page Screenshot](screenshots/quiz-page.png)

### Progress Tracking
![Progress Page Screenshot](screenshots/progress-page.png)

---

> Replace the placeholder links and screenshot paths with your actual deployment, video, and screenshot files. 