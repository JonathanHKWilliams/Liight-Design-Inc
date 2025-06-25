const EMAIL_TEMPLATES = {
  // Donation Email Template (HTML)
  DONATION_TEMPLATE: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Donation Received - LIIGHT DESIGN INC</title>
      <style>
        body { 
          font-family: 'Poppins', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 16px; 
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #003F12 0%, #00C44F 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-family: 'Changa', Arial, sans-serif; 
          font-size: 28px; 
          font-weight: bold;
        }
        .content { 
          padding: 30px; 
        }
        .donation-amount { 
          background: linear-gradient(135deg, #00C44F, #003F12); 
          color: white; 
          padding: 20px; 
          border-radius: 12px; 
          text-align: center; 
          margin: 20px 0;
        }
        .donation-amount h2 { 
          margin: 0; 
          font-family: 'Changa', Arial, sans-serif; 
          font-size: 36px; 
        }
        .info-section { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 15px 0; 
        }
        .info-section h3 { 
          color: #003F12; 
          margin-top: 0; 
          font-family: 'Changa', Arial, sans-serif; 
        }
        .reward-badge { 
          background: linear-gradient(45deg, #FFD700, #FFA500); 
          color: #003F12; 
          padding: 15px; 
          border-radius: 8px; 
          text-align: center; 
          font-weight: bold; 
          margin: 20px 0; 
        }
        .footer { 
          background: #003F12; 
          color: white; 
          padding: 20px; 
          text-align: center; 
          font-size: 14px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Donation Received!</h1>
          <p>LIIGHT DESIGN INC</p>
        </div>
        
        <div class="content">
          <div class="donation-amount">
            <h2>\${donation_amount}</h2>
            <p>Generous Donation Received</p>
          </div>
          
          <div class="info-section">
            <h3>Donor Information</h3>
            <p><strong>Name:</strong> \${from_name}</p>
            <p><strong>Email:</strong> \${from_email}</p>
            <p><strong>Message:</strong> \${message}</p>
          </div>
          
          <div class="info-section">
            <h3>Billing Information</h3>
            <p><strong>Name:</strong> \${billing_name}</p>
            <p><strong>Address:</strong> \${billing_address}</p>
          </div>
          
          

          <p>This donation will help us complete our project and bring our vision to life. Please follow up with the donor within 24 hours to express our gratitude.</p>
        </div>
        
        <div class="footer">
          <p>© 2025 LIIGHT DESIGN INC. All rights reserved.</p>
          <p>This is an automated notification from your website.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Project Inquiry Email Template (HTML)
  PROJECT_INQUIRY_TEMPLATE: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Project Inquiry - LIIGHT DESIGN INC</title>
      <style>
        body { 
          font-family: 'Poppins', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 16px; 
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #003F12 0%, #00C44F 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-family: 'Changa', Arial, sans-serif; 
          font-size: 28px; 
          font-weight: bold;
        }
        .content { 
          padding: 30px; 
        }
        .client-info { 
          background: linear-gradient(135deg, #00C44F10, #003F1210); 
          padding: 20px; 
          border-radius: 12px; 
          border-left: 4px solid #00C44F; 
          margin: 20px 0; 
        }
        .info-section { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 15px 0; 
        }
        .info-section h3 { 
          color: #003F12; 
          margin-top: 0; 
          font-family: 'Changa', Arial, sans-serif; 
        }
        .cta-section { 
          background: linear-gradient(135deg, #003F12, #00C44F); 
          color: white; 
          padding: 20px; 
          border-radius: 8px; 
          text-align: center; 
          margin: 20px 0; 
        }
        .footer { 
          background: #003F12; 
          color: white; 
          padding: 20px; 
          text-align: center; 
          font-size: 14px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Project Inquiry!</h1>
          <p>LIIGHT DESIGN INC</p>
        </div>
        
        <div class="content">
          <div class="client-info">
            <h2 style="color: #003F12; margin-top: 0; font-family: 'Changa', Arial, sans-serif;">
              Potential Client Details
            </h2>
            <p><strong>Name:</strong> \${from_name}</p>
            <p><strong>Email:</strong> \${from_email}</p>
            <p><strong>Organization Type:</strong> \${organization_type}</p>
            <p><strong>Project File:</strong> \${project_file_name}</p>
            <div style="margin: 15px 0; padding: 15px; background-color: #f0f8ff; border-radius: 8px; border-left: 4px solid #003F12;">
              <p style="margin: 0;"><strong> View The Project PDF:</strong></p>
              <a href="\${project_file_url}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #003F12; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Open PDF Document</a>
            </div>
          </div>
          
          <div class="info-section">
            <h3>Next Steps</h3>
            <ul>
              <li>Review the attached project file</li>
              <li>Respond within 24 hours to maintain professional standards</li>
              <li>Schedule a consultation call if the project aligns with our services</li>
              <li>Prepare a preliminary quote and timeline</li>
            </ul>
          </div>
          
          <div class="cta-section">
            <h3 style="margin-top: 0;">Ready to Create Something Amazing?</h3>
            <p>This could be the next big project for LIIGHT DESIGN INC. Let's turn their vision into reality!</p>
          </div>
          
          <p><strong>Important:</strong> Please reply directly to this email to respond to the client. Their email address is: <a href="mailto:\${from_email}" style="color: #00C44F;">\${from_email}</a></p>
        </div>
        
        <div class="footer">
          <p>© 2025 LIIGHT DESIGN INC. All rights reserved.</p>
          <p>This inquiry was submitted through your website's project form.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Thank You Email Template for users who submit inquiries (HTML)
  THANK_YOU_TEMPLATE: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank You for Your Project Inquiry - LIIGHT DESIGN INC</title>
      <style>
        body { 
          font-family: 'Poppins', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 16px; 
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #003F12 0%, #00C44F 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-family: 'Changa', Arial, sans-serif; 
          font-size: 28px; 
          font-weight: bold;
        }
        .content { 
          padding: 30px; 
        }
        .thank-you-message { 
          background: linear-gradient(135deg, #00C44F10, #003F1210); 
          padding: 20px; 
          border-radius: 12px; 
          border-left: 4px solid #00C44F; 
          margin: 20px 0; 
        }
        .project-details { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 15px 0; 
        }
        .project-details h3 { 
          color: #003F12; 
          margin-top: 0; 
          font-family: 'Changa', Arial, sans-serif; 
        }
        .next-steps { 
          background: linear-gradient(135deg, #003F12, #00C44F); 
          color: white; 
          padding: 20px; 
          border-radius: 8px; 
          text-align: center; 
          margin: 20px 0; 
        }
        .footer { 
          background: #003F12; 
          color: white; 
          padding: 20px; 
          text-align: center; 
          font-size: 14px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Project Inquiry!</h1>
          <p>LIIGHT DESIGN INC</p>
        </div>
        
        <div class="content">
          <div class="thank-you-message">
            <h2 style="color: #003F12; margin-top: 0; font-family: 'Changa', Arial, sans-serif;">
              Hello \${name}!
            </h2>
            <p>Thank you for submitting your project inquiry to LIIGHT DESIGN INC. We're excited to review your project and explore how we can bring your vision to life!</p>
          </div>
          
          <div class="project-details">
            <h3>Your Project Details</h3>
            <p><strong>Project File:</strong> \${project_file_name}</p>
            <p>Our team is currently reviewing your submission and will get back to you soon with personalized insights and possibilities.</p>
          </div>
          
          <div class="next-steps">
            <h3 style="margin-top: 0;">What Happens Next?</h3>
            <p>Our design team is reviewing your project details. We'll contact you within 1-2 business days to discuss your project in more detail and explore how we can work together.</p>
          </div>
          
          <p>If you have any immediate questions, feel free to reply to this email or contact us at <a href="mailto:liightdesigninc@gmail.com" style="color: #00C44F;">liightdesigninc@gmail.com</a>.</p>
          
          <p>We look forward to the possibility of working with you!</p>
          
          <p style="margin-top: 30px;">Best regards,<br><strong>The LIIGHT DESIGN Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2025 LIIGHT DESIGN INC. All rights reserved.</p>
          <p>This is an automated response to your project inquiry submission.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Donation Receipt Email Template for donors (HTML)
  DONATION_RECEIPT_TEMPLATE: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank You for Your Donation - LIIGHT DESIGN INC</title>
      <style>
        body { 
          font-family: 'Poppins', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 16px; 
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #003F12 0%, #00C44F 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-family: 'Changa', Arial, sans-serif; 
          font-size: 28px; 
          font-weight: bold;
        }
        .content { 
          padding: 30px; 
        }
        .thank-you-message { 
          background: linear-gradient(135deg, #00C44F10, #003F1210); 
          padding: 20px; 
          border-radius: 12px; 
          border-left: 4px solid #00C44F; 
          margin: 20px 0; 
        }
        .donation-amount { 
          background: linear-gradient(135deg, #00C44F, #003F12); 
          color: white; 
          padding: 20px; 
          border-radius: 12px; 
          text-align: center; 
          margin: 20px 0;
        }
        .donation-amount h2 { 
          margin: 0; 
          font-family: 'Changa', Arial, sans-serif; 
          font-size: 36px; 
        }
        .receipt-details { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 15px 0; 
        }
        .receipt-details h3 { 
          color: #003F12; 
          margin-top: 0; 
          font-family: 'Changa', Arial, sans-serif; 
        }
        .impact-message { 
          background: linear-gradient(135deg, #003F12, #00C44F); 
          color: white; 
          padding: 20px; 
          border-radius: 8px; 
          text-align: center; 
          margin: 20px 0; 
        }
        .footer { 
          background:rgb(0, 0, 0); 
          color: white; 
          padding: 20px; 
          text-align: center; 
          font-size: 14px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Donation!</h1>
          <p>LIIGHT DESIGN INC</p>
        </div>
        
        <div class="content">
          <div class="thank-you-message">
            <h2 style="color: #003F12; margin-top: 0; font-family: 'Changa', Arial, sans-serif;">
              Hello \${name}!
            </h2>
            <p>Thank you for your generous donation to LIIGHT DESIGN INC. Your support means the world to us and will help bring our vision to life!</p>
          </div>
          
          <div class="donation-amount">
            <h2>\${donation_amount}</h2>
            <p>Your Generous Contribution</p>
          </div>
          
          <div class="receipt-details">
            <h3>Donation Receipt</h3>
            <p><strong>Transaction ID:</strong> \${transaction_id}</p>
            <p><strong>Date:</strong> \${date}</p>
            <p><strong>Payment Method:</strong> Credit Card (ending in \${last_four})</p>
          </div>
          
          <div class="impact-message">
            <h3 style="margin-top: 0;">Your Impact</h3>
            <p>Your donation directly supports our mission to create innovative, sustainable design solutions that make a difference in our community.</p>
          </div>
          
          <p>This email serves as your official receipt for tax purposes. Please keep it for your records.</p>
          
          <p>If you have any questions about your donation, please contact us at <a href="mailto:liightdesigninc@gmail.com" style="color: #00C44F;">liightdesigninc@gmail.com</a>.</p>
          
          <p style="margin-top: 30px;">With gratitude,<br><strong>The LIIGHT DESIGN Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2025 LIIGHT DESIGN INC. All rights reserved.</p>
          <p>This is an automated receipt for your donation.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

export { EMAIL_TEMPLATES };
