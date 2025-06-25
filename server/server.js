import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bodyParser from 'body-parser';

dotenv.config();
console.log("Mailjet Public Key:", process.env.MAILJET_API_KEY);
console.log("Mailjet Secret Key:", process.env.MAILJET_SECRET_KEY);
console.log("DKIM Private Key:", process.env.DKIM_PRIVATE_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Add a test route to confirm Express is working
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend connected!" });
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '40mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '40mb' }));

// Create reusable Nodemailer transporter with Mailjet configuration
const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILJET_API_KEY,
    pass: process.env.MAILJET_SECRET_KEY
  },
  // Improve email deliverability with DKIM support
  dkim: {
    domainName: 'liightdesigninc.com',
    keySelector: 'mailjet',
    privateKey: process.env.DKIM_PRIVATE_KEY || ''
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Helper function to format HTML for project inquiry emails
const formatProjectInquiryEmail = (data) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Project Inquiry</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Organization:</strong> ${data.organization || 'Not provided'}</p>
      <h3 style="color: #555;">Project Details:</h3>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${data.projectDetails.replace(/\n/g, '<br>')}
      </div>
      ${data.pdfUrl ? `<p><strong>Attached PDF:</strong> <a href="${data.pdfUrl}">View PDF</a></p>` : ''}
    </div>
  `;
};

// Helper function to format HTML for thank you emails to inquirers
const formatThankYouEmail = (data) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Thank You for Your Inquiry</h2>
      <p>Dear ${data.fullName},</p>
      <p>Thank you for reaching out to LIIGHT DESIGN INC. We have received your project inquiry and are excited to learn more about your needs.</p>
      <p>Our team will review your submission and get back to you within 2-3 business days.</p>
      <p>Here's a summary of the information you provided:</p>
      <ul>
        <li><strong>Name:</strong> ${data.fullName}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Organization:</strong> ${data.organization || 'Not provided'}</li>
        <li><strong>Project Details:</strong> ${data.projectDetails.substring(0, 100)}${data.projectDetails.length > 100 ? '...' : ''}</li>
      </ul>
      <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The LIIGHT DESIGN Team</p>
    </div>
  `;
};

// Helper function to format HTML for donation receipt emails
const formatDonationReceiptEmail = (data) => {
  const donationDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const receiptId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const isHighDonation = data.amount >= 100;
  const discountCode = isHighDonation ? `${receiptId}-${Math.random().toString(36).substring(2, 6).toUpperCase()}` : '';
  const lastFour = data.cardNumber ? data.cardNumber.slice(-4) : 'XXXX';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Donation Receipt</h2>
      <p>Dear ${data.name || 'Valued Supporter'},</p>
      <p>Thank you for your generous donation to LIIGHT DESIGN INC. Your support helps us bring innovative design solutions to communities in need.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #555;">Receipt Details</h3>
        <p><strong>Receipt ID:</strong> ${receiptId}</p>
        <p><strong>Date:</strong> ${donationDate}</p>
        <p><strong>Amount:</strong> $${data.amount.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> Card ending in ${lastFour}</p>
        <p><strong>Donation Type:</strong> ${data.frequency || 'One-time'}</p>
      </div>
      
      ${isHighDonation ? `
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2e7d32;">Special Discount</h3>
          <p>As a token of our appreciation for your generous donation of $100 or more, you've earned a 15% discount on your next design project with us.</p>
          <p><strong>Your discount code:</strong> <span style="background: #f1f1f1; padding: 5px 10px; border-radius: 3px;">${discountCode}</span></p>
          <p>This code is valid for one year from today.</p>
        </div>
      ` : ''}
      
      <p>This donation may be tax-deductible to the extent allowed by law. Please consult your tax advisor for more information.</p>
      <p>Thank you again for your support!</p>
      <p>Best regards,<br>The LIIGHT DESIGN Team</p>
    </div>
  `;
};

// Helper function to format HTML for admin donation notification
const formatAdminDonationEmail = (data) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Donation Received</h2>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p><strong>Amount:</strong> $${data.amount.toFixed(2)}</p>
        <p><strong>Frequency:</strong> ${data.frequency || 'One-time'}</p>
        <p><strong>Donor Name:</strong> ${data.name || 'Anonymous'}</p>
        <p><strong>Donor Email:</strong> ${data.email || 'Not provided'}</p>
        <p><strong>Discount Eligible:</strong> ${data.amount >= 100 ? 'Yes - 15% discount on next design project' : 'No'}</p>
      </div>
      
      ${data.message ? `
        <h3 style="color: #555;">Message from Donor:</h3>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${data.message.replace(/\n/g, '<br>')}
        </div>
      ` : ''}
      
      <h3 style="color: #555;">Billing Information:</h3>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p><strong>Name:</strong> ${data.billingInfo.firstName} ${data.billingInfo.lastName}</p>
        <p><strong>Address:</strong> ${data.billingInfo.address}, ${data.billingInfo.city}, ${data.billingInfo.state} ${data.billingInfo.zipCode}, ${data.billingInfo.country}</p>
      </div>
    </div>
  `;
};

// API endpoint for project inquiry form
app.post('/api/send-project-inquiry', async (req, res) => {
  const { fullName, email, organization, projectDetails, pdfUrl } = req.body;

  try {
    // Validate required fields
    if (!fullName || !email || !projectDetails) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Send notification email to admin
    await transporter.sendMail({
      from: '"LIIGHT DESIGN INC" <liightdesigninc@gmail.com>',
      to: 'liightdesigninc@gmail.com', // Admin email
      subject: 'New Project Inquiry',
      html: formatProjectInquiryEmail({ fullName, email, organization, projectDetails, pdfUrl }),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Entity-Ref-ID': `inquiry-${Date.now()}`
      }
    });

    // Send thank you email to inquirer
    await transporter.sendMail({
      from: '"LIIGHT DESIGN INC" <liightdesigninc@gmail.com>',
      to: email,
      subject: 'Thank You for Your Inquiry',
      html: formatThankYouEmail({ fullName, email, organization, projectDetails }),
      headers: {
        'X-Entity-Ref-ID': `thank-you-${Date.now()}`,
        'List-Unsubscribe': '<mailto:unsubscribe@liightdesigninc.com>'
      }
    });

    res.status(200).json({ success: true, message: 'Project inquiry submitted successfully' });
  } catch (error) {
    console.error('Error sending project inquiry emails:', error);
    res.status(500).json({ success: false, message: 'Error sending emails', error: error.message });
  }
});

// API endpoint for donation form
app.post('/api/send-donation', async (req, res) => {
  const { 
    amount, 
    frequency,
    donorInfo, 
    billingInfo, 
    cardInfo 
  } = req.body;

  try {
    // Validate required fields
    if (!amount || !billingInfo) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Send notification email to admin
    await transporter.sendMail({
      from: '"LIIGHT DESIGN INC" <liightdesigninc@gmail.com>',
      to: 'liightdesigninc@gmail.com', // Admin email
      subject: `New Donation Received - $${amount}`,
      html: formatAdminDonationEmail({ 
        amount, 
        frequency, 
        donorInfo, 
        message: donorInfo.message,
        billingInfo
      }),
      replyTo: donorInfo.email || 'liightdesigninc@gmail.com',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Entity-Ref-ID': `donation-admin-${Date.now()}`
      }
    });

    // Send receipt email to donor if email is provided
    if (donorInfo.email) {
      await transporter.sendMail({
        from: '"LIIGHT DESIGN INC" <liightdesigninc@gmail.com>',
        to: donorInfo.email,
        subject: 'Thank You for Your Donation to LIIGHT DESIGN INC',
        html: formatDonationReceiptEmail({
          amount,
          donorName: donorInfo.name,
          cardLastFour: cardInfo.cardNumber.slice(-4),
          isHighDonation: amount >= 100,
          billingInfo
        }),
        replyTo: 'liightdesigninc@gmail.com',
        headers: {
          'X-Entity-Ref-ID': `donation-receipt-${Date.now()}`,
          'List-Unsubscribe': '<mailto:unsubscribe@liightdesigninc.com>',
          'Precedence': 'bulk'
        }
      });
    }

    res.status(200).json({ success: true, message: 'Donation processed successfully' });
  } catch (error) {
    console.error('Error sending donation emails:', error);
    res.status(500).json({ success: false, message: 'Error sending emails', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

