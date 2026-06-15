# TaskPlanet Social Feed Application

This is a premium, full-stack responsive social media feed application inspired by the TaskPlanet Social Feed. It is built using Node.js, Express, and MongoDB on the backend, and React, Vite, Redux Toolkit, and Material UI on the frontend.

## Key Features

- **Authentication Flow:** Secure User registration and login using JWT and `bcryptjs`.
- **Social Feed:** A card-based feed displaying user posts sorted by date descending.
- **Media Uploads:** Supports uploading text and/or images for posts. Images are validated, processed, and stored on the server via `multer`.
- **Likes & Comments:** Multi-user likes and comments under each post, with **Optimistic UI** updates on the frontend for instant visual responsiveness.
- **Pagination:** Smooth feed pagination via a "Load More" button to fetch older posts.
- **Premium UI/UX:** Built with a custom Tailwind-inspired Material UI theme using modern typography (Inter), glassmorphism, responsive elements, and dynamic hover states.

---

## Architecture Overview

```
Task/
├── backend/
│   ├── config/             # DB configuration
│   ├── controllers/        # Auth & Post controller logic
│   ├── middleware/         # Auth, Upload, and Error Middlewares
│   ├── models/             # Mongoose Schemas (User, Post)
│   ├── routes/             # Express API Route endpoints
│   └── server.js           # Express App Entrypoint
└── frontend/
    ├── src/
    │   ├── app/            # Redux Store Config
    │   ├── components/     # Header, PostCard, CreatePost, ProtectedRoute
    │   ├── features/       # Redux slices & API services (Auth, Posts)
    │   ├── pages/          # Login, Register, Feed Pages
    │   ├── App.jsx         # App router & Theme styling
    │   └── main.jsx        # App root
```

---

## Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed and running locally

### 1. Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Make sure dependencies are installed:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and set your variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/social_media
   JWT_SECRET=supersecretkey123
   NODE_ENV=development
   ```
4. Start the backend server:
   - For development (with Nodemon):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

### 2. Frontend Setup

1. Open another terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Make sure dependencies are installed:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## Production Deployment Instructions

### Deploying Backend to Render

1. Create a Web Service on **Render**.
2. Connect your GitHub repository.
3. Configure the following build settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add the following **Environment Variables**:
   - `MONGO_URI`: Your MongoDB Atlas URI (connection string)
   - `JWT_SECRET`: A secure random secret string
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render allocates this automatically)

### Deploying Frontend to Vercel

1. Create a project on **Vercel**.
2. Connect your GitHub repository.
3. Configure the following project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add the following **Environment Variables**:
   - `VITE_API_URL`: The URL of your deployed Render backend (e.g. `https://your-backend.onrender.com`)
5. Click **Deploy**.
