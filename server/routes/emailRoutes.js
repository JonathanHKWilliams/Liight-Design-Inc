/**
 * Email routes for handling project inquiries and donations
 */
import express from 'express';
const router = express.Router();
import { EMAIL_TEMPLATES } from '../utils/emailTemplates.js';
import { sendEmailWithTemplate } from '../utils/emailUtils.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure uploads directory
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Handle project inquiry submissions
 */
router.post('/send-project-inquiry', async (req, res) => {
  try {
    const { fullName, email, organizationType, projectDetails, pdfUrl } = req.body;
    
    // Validate required fields
    if (!fullName || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    
    let fileUrl = '#';
    let fileName = projectDetails || 'No file attached';
    let pdfPath = null;
    
    // Handle base64 data URL from request body
    if (pdfUrl && pdfUrl.startsWith('data:application/pdf;base64,')) {
      // Extract the base64 data and convert to a file
      const base64Data = pdfUrl.replace(/^data:application\/pdf;base64,/, '');
      const randomName = crypto.randomBytes(16).toString('hex');
      const safeFileName = `${Date.now()}-${randomName}.pdf`;
      pdfPath = path.join(uploadsDir, safeFileName);
      
      // Write the file to disk
      fs.writeFileSync(pdfPath, Buffer.from(base64Data, 'base64'));
      
      // Generate the public URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      fileUrl = `${baseUrl}/uploads/${safeFileName}`;
      
      console.log('Converted base64 PDF to file:', safeFileName);
    }
    
    // Send email to admin
    await sendEmailWithTemplate({
      to: process.env.ADMIN_EMAIL || 'liightdesigninc@gmail.com',
      subject: 'New Project Inquiry - LIIGHT DESIGN',
      template: EMAIL_TEMPLATES.PROJECT_INQUIRY_TEMPLATE,
      data: {
        from_name: fullName,
        from_email: email,
        organization_type: organizationType || 'Not specified',
        project_file_name: fileName,
        project_file_url: fileUrl
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
        project_file_name: projectDetails || 'Your project details'
      }
    });
    
    res.status(200).json({ success: true, message: 'Project inquiry submitted successfully' });
  } catch (error) {
    console.error('Error sending project inquiry emails:', error);
    res.status(500).json({ success: false, message: 'Failed to send project inquiry emails' });
  }
});

/**
 * Handle donation submissions
 */
router.post('/send-donation', async (req, res) => {
  try {
    const { amount, frequency, paymentMethod, donorInfo, billingInfo, paymentInfo } = req.body;
    
    // Validate required fields
    if (!amount || !donorInfo) {
      return res.status(400).json({ success: false, message: 'Donation amount and donor info are required' });
    }
    
    // Format donation amount
    const formattedAmount = `$${parseFloat(amount).toFixed(2)}`;
    
    // Check if donation is eligible for discount (≥ $100)
    const discountEligible = parseFloat(amount) >= 100;
    
    // Format billing address
    const billingAddress = billingInfo ? 
      `${billingInfo.address}, ${billingInfo.city}, ${billingInfo.state} ${billingInfo.zipCode}, ${billingInfo.country}` : 
      'Not provided';
    
    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Format date
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Format payment method name for display
    const formatPaymentMethod = (method) => {
      switch(method) {
        case 'stripe': return 'Credit/Debit Card (Stripe)';
        case 'paypal': return 'PayPal';
        case 'orange': return 'Orange Money';
        case 'lonestar': return 'Lonestar Mobile Money';
        default: return 'Online Payment';
      }
    };
    
    // Format payment details based on payment method
    const formatPaymentDetails = (method, info) => {
      if (!info) return 'Not provided';
      
      if (method === 'stripe' || method === 'paypal') {
        // Card payment
        return `Card ending in ${info.cardNumber ? info.cardNumber.slice(-4) : 'XXXX'}`;
      } else {
        // Mobile money
        return `Phone: ${info.phoneNumber ? maskPhoneNumber(info.phoneNumber) : 'Not provided'}`;
      }
    };
    
    // Mask phone number for privacy
    const maskPhoneNumber = (phone) => {
      if (!phone || phone.length < 4) return 'XXXX';
      return phone.replace(/\d(?=\d{4})/g, '*');
    };
    
    // Get last 4 digits of card number (if available)
    const lastFour = paymentInfo && paymentMethod === 'stripe' || paymentMethod === 'paypal' ? 
      (paymentInfo.cardNumber ? paymentInfo.cardNumber.slice(-4) : 'XXXX') : 
      'XXXX';
    
    // Send email to admin
    await sendEmailWithTemplate({
      to: process.env.ADMIN_EMAIL || 'liightdesigninc@gmail.com',
      subject: `New ${formattedAmount} Donation Received - LIIGHT DESIGN`,
      template: EMAIL_TEMPLATES.DONATION_TEMPLATE,
      data: {
        donation_amount: formattedAmount,
        from_name: donorInfo.name || 'Anonymous',
        from_email: donorInfo.email || 'Not provided',
        message: donorInfo.message || 'No message',
        billing_name: billingInfo ? `${billingInfo.firstName} ${billingInfo.lastName}` : 'Not provided',
        billing_address: billingAddress,
        discount_eligible: discountEligible,
        payment_method: formatPaymentMethod(paymentMethod),
        payment_details: formatPaymentDetails(paymentMethod, paymentInfo),
        donation_frequency: frequency === 'monthly' ? 'Monthly Recurring' : 'One-time'
      }
    });
    
    // Send receipt to donor (if email provided)
    if (donorInfo.email) {
      await sendEmailWithTemplate({
        to: donorInfo.email,
        subject: 'Thank You for Your Donation - LIIGHT DESIGN',
        template: EMAIL_TEMPLATES.DONATION_RECEIPT_TEMPLATE,
        data: {
          name: donorInfo.name || 'Valued Donor',
          donation_amount: formattedAmount,
          transaction_id: transactionId,
          date: date,
          last_four: lastFour,
          payment_method: formatPaymentMethod(paymentMethod),
          donation_frequency: frequency === 'monthly' ? 'Monthly Recurring' : 'One-time'
        }
      });
    }
    
    res.status(200).json({ success: true, message: 'Donation processed successfully' });
  } catch (error) {
    console.error('Error sending donation emails:', error);
    res.status(500).json({ success: false, message: 'Failed to process donation' });
  }
});

export default router;
