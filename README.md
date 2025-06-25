# Liight Design Inc Website

This repository contains the website for Liight Design Inc, with a React frontend and Node.js backend.

## Project Structure

The project is organized into two main directories:

- `/client`: Contains all frontend code (React/Vite application)
- `/server`: Contains all backend code (Node.js/Express server)

## Development

### Prerequisites

- Node.js (v16+)
- npm

### Running the Application

1. Install dependencies for both client and server:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
cd ..
```

2. Create a `.env` file in the server directory with your Mailjet credentials:

```
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
DKIM_PRIVATE_KEY=your_dkim_private_key
```

3. Run both frontend and backend concurrently:

```bash
npm run dev
```

- Frontend runs on: http://localhost:5173
- Backend runs on: http://localhost:3001

## Building for Production

```bash
npm run build
```

This will build the client application for production deployment.