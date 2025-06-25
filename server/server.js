import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import emailRoutes from './routes/emailRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { transporter } from './utils/emailUtils.js';
import favicon from 'serve-favicon';

dotenv.config();

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Mailjet Public Key:", process.env.MAILJET_API_KEY);
console.log("Mailjet Secret Key:", process.env.MAILJET_SECRET_KEY);
console.log("DKIM Private Key:", process.env.DKIM_PRIVATE_KEY);

const app = express();
const PORT = process.env.PORT || 3002; // Changed to 3002 to avoid port conflict

// Add a test route to confirm Express is working
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend connected!" });
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '40mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '40mb' }));

// Serve favicon if available
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
try {
  if (fs.existsSync(faviconPath)) {
    app.use(favicon(faviconPath));
    console.log(`Serving favicon from: ${faviconPath}`);
  }
} catch (err) {
  console.log('Favicon not found, continuing without it');
}

// Serve uploads directory statically
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));
console.log(`Serving uploads directory from: ${uploadsPath}`);

// Use email routes
app.use('/api', emailRoutes);

// Use upload routes
app.use('/api', uploadRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Note: Transporter configuration has been moved to emailUtils.js

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Email service ready');
});

// Note: Email formatting functions have been moved to emailTemplates.js

// Note: API endpoints for project inquiry and donation have been moved to emailRoutes.js


transporter.verify((error, success) => {
  if (error) {
    console.error('Error verifying transporter:', error);
  } else {
    console.log('Transporter verified successfully');
  }
});


export default app;

