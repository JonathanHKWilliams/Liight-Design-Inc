/**
 * Routes for handling file uploads
 */
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { sendEmailWithTemplate } from '../utils/emailUtils.js';
import { EMAIL_TEMPLATES } from '../utils/emailTemplates.js';

const router = express.Router();

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure uploads directory
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate a secure, random filename to prevent overwriting and path traversal
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileExt = path.extname(file.originalname).toLowerCase();
    const safeFileName = `${Date.now()}-${randomName}${fileExt}`;
    
    // Store the original filename and the new safe filename in the request
    req.fileData = {
      originalName: file.originalname,
      safeFileName: safeFileName,
      mimeType: file.mimetype
    };
    
    cb(null, safeFileName);
  }
});

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB max file size
  },
  fileFilter: fileFilter
});

/**
 * Handle project inquiry form submission with PDF upload
 * Supports both multipart/form-data uploads and base64 data URLs
 */
router.post('/project-inquiry-with-pdf', upload.single('pdfFile'), async (req, res) => {
  try {
    // Get form data
    const { fullName, email, organizationType, projectDetails } = req.body;
    
    // Validate required fields
    if (!fullName || !email) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    
    let fileUrl = null;
    let fileName = 'No file attached';
    let pdfPath = null;
    
    // Handle regular file upload via multer
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
      fileName = req.fileData?.originalName || req.file.originalname || 'uploaded-file.pdf';
      pdfPath = req.file.path;
    }
    // Handle base64 data URL from request body
    else if (req.body.pdfUrl && req.body.pdfUrl.startsWith('data:application/pdf;base64,')) {
      // Extract the base64 data and convert to a file
      const base64Data = req.body.pdfUrl.replace(/^data:application\/pdf;base64,/, '');
      const randomName = crypto.randomBytes(16).toString('hex');
      const safeFileName = `${Date.now()}-${randomName}.pdf`;
      pdfPath = path.join(uploadsDir, safeFileName);
      
      // Write the file to disk
      fs.writeFileSync(pdfPath, Buffer.from(base64Data, 'base64'));
      
      // Generate the public URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      fileUrl = `${baseUrl}/uploads/${safeFileName}`;
      fileName = req.body.pdfFileName || 'document.pdf';
      
      console.log('Converted base64 PDF to file:', safeFileName);
    }
    
    console.log('Project inquiry with PDF received:', {
      fullName,
      email,
      organizationType,
      projectDetails,
      fileName,
      fileUrl: fileUrl ? 'URL generated successfully' : 'No URL available'
    });
    
    // Log the exact URL for debugging
    console.log('PDF URL for email:', fileUrl);
    
    // Send email to admin with PDF attachment
    await sendEmailWithTemplate({
      to: process.env.ADMIN_EMAIL || 'liightdesigninc@gmail.com',
      subject: 'New Project Inquiry with PDF - LIIGHT DESIGN',
      template: EMAIL_TEMPLATES.PROJECT_INQUIRY_TEMPLATE,
      data: {
        from_name: fullName,
        from_email: email,
        organization_type: organizationType || 'Not specified',
        project_details: projectDetails || 'No details provided',
        project_file_name: fileName,
        project_file_url: fileUrl || 'project_file_url'
      },
      replyTo: email,
      attachments: pdfPath ? [
        {
          filename: fileName,
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ] : []
    });
    
    // Send thank you email to user
    await sendEmailWithTemplate({
      to: email,
      subject: 'Thank You for Your Project Inquiry - LIIGHT DESIGN',
      template: EMAIL_TEMPLATES.THANK_YOU_TEMPLATE,
      data: {
        name: fullName,
        project_file_name: fileName
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Project inquiry submitted successfully',
      file: pdfPath ? {
        originalName: fileName,
        url: fileUrl
      } : null
    });
  } catch (error) {
    console.error('Error processing project inquiry with PDF:', error);
    
    // Delete uploaded file if there's an error
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
      console.log('Deleted PDF file due to error:', pdfPath);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to process project inquiry',
      error: error.message
    });
  }
});

export default router;
