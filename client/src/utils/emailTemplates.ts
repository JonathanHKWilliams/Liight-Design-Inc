// Email template configurations for LIIGHT DESIGN INC
// These templates should be created in your EmailJS dashboard

export const EMAIL_TEMPLATES = {
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
            <h2>${{donation_amount}}</h2>
            <p>Generous Donation Received</p>
          </div>
          
          <div class="info-section">
            <h3>Donor Information</h3>
            <p><strong>Name:</strong> {{from_name}}</p>
            <p><strong>Email:</strong> {{from_email}}</p>
            <p><strong>Message:</strong> {{message}}</p>
          </div>
          
          <div class="info-section">
            <h3>Billing Information</h3>
            <p><strong>Name:</strong> {{billing_name}}</p>
            <p><strong>Address:</strong> {{billing_address}}</p>
          </div>
          
          {{#if discount_eligible}}
          <div class="reward-badge">
            SPECIAL REWARD ELIGIBLE!<br>
            This donor qualifies for a 15% discount on their next design project!
          </div>
          {{/if}}
          
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
          <h1>🚀 New Project Inquiry!</h1>
          <p>LIIGHT DESIGN INC</p>
        </div>
        
        <div class="content">
          <div class="client-info">
            <h2 style="color: #003F12; margin-top: 0; font-family: 'Changa', Arial, sans-serif;">
              Potential Client Details
            </h2>
            <p><strong>Name:</strong> {{from_name}}</p>
            <p><strong>Email:</strong> {{from_email}}</p>
            <p><strong>Project File:</strong> {{project_file}}</p>
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
          
          <p><strong>Important:</strong> Please reply directly to this email to respond to the client. Their email address is: <a href="mailto:{{from_email}}" style="color: #00C44F;">{{from_email}}</a></p>
        </div>
        
        <div class="footer">
          <p>© 2025 LIIGHT DESIGN INC. All rights reserved.</p>
          <p>This inquiry was submitted through your website's project form.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

// EmailJS Configuration Instructions
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
          <h1>✨ Thank You for Your Project Inquiry!</h1>
          <p>LIIGHT DESIGN INC</p>
        </div>
        
        <div class="content">
          <div class="thank-you-message">
            <h2 style="color: #003F12; margin-top: 0; font-family: 'Changa', Arial, sans-serif;">
              Hello {{name}}!
            </h2>
            <p>Thank you for submitting your project inquiry to LIIGHT DESIGN INC. We're excited to review your project and explore how we can bring your vision to life!</p>
          </div>
          
          <div class="project-details">
            <h3>Your Project Details</h3>
            <p><strong>Project File:</strong> {{project_file}}</p>
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
        .receipt-section { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 15px 0; 
        }
        .receipt-section h3 { 
          color: #003F12; 
          margin-top: 0; 
          font-family: 'Changa', Arial, sans-serif; 
        }
        .receipt-details {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          background: white;
        }
        .receipt-details table {
          width: 100%;
          border-collapse: collapse;
        }
        .receipt-details td {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .receipt-details td:first-child {
          font-weight: 600;
          color: #555;
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
          <h1>Thank You for Your Donation!</h1>
          <p>LIIGHT DESIGN INC</p>
        </div>
        
        <div class="content">
          <p>Dear {{donor_name}},</p>
          
          <p>Thank you for your generous support of LIIGHT DESIGN INC. Your contribution helps us bring our vision to life and create amazing designs that make a difference.</p>
          
          <div class="donation-amount">
            <h2>${{donation_amount}}</h2>
            <p>Donation Amount</p>
          </div>
          
          <div class="receipt-section">
            <h3>Donation Receipt</h3>
            <div class="receipt-details">
              <table>
                <tr>
                  <td>Receipt ID:</td>
                  <td>LD-{{receipt_id}}</td>
                </tr>
                <tr>
                  <td>Date:</td>
                  <td>{{donation_date}}</td>
                </tr>
                <tr>
                  <td>Donor Name:</td>
                  <td>{{donor_name}}</td>
                </tr>
                <tr>
                  <td>Donor Email:</td>
                  <td>{{donor_email}}</td>
                </tr>
                <tr>
                  <td>Billing Address:</td>
                  <td>{{billing_address}}</td>
                </tr>
                <tr>
                  <td>Payment Method:</td>
                  <td>Credit Card (xxxx-xxxx-xxxx-{{last_four}})</td>
                </tr>
              </table>
            </div>
          </div>
          
          {{#if discount_eligible}}
          <div class="reward-badge">
            <p>SPECIAL REWARD INCLUDED!</p>
            <p>You've earned a 15% discount on your next design project with us!</p>
            <p>Use code: <strong>LIIGHT-{{discount_code}}</strong></p>
            <p>Valid for 12 months from today</p>
          </div>
          {{/if}}
          
          <p>Your donation is greatly appreciated and will be used to support our ongoing projects and initiatives. If you have any questions about your donation or would like to learn more about our work, please don't hesitate to contact us.</p>
          
          <p style="margin-top: 30px;">With gratitude,<br><strong>The LIIGHT DESIGN Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2025 LIIGHT DESIGN INC. All rights reserved.</p>
          <p>This receipt is for your records and tax purposes.</p>
        </div>
      </div>
    </body>
    </html>
  `,

};  // Close EMAIL_TEMPLATES object

export const EMAILJS_SETUP_INSTRUCTIONS = `
To set up EmailJS for LIIGHT DESIGN INC:

1. Create an account at https://www.emailjs.com/
2. Create a new service (Gmail, Outlook, etc.)
3. Create four email templates:
   - Template ID: 'donation_template' (use DONATION_TEMPLATE HTML above)
   - Template ID: 'project_inquiry_template' (use PROJECT_INQUIRY_TEMPLATE HTML above)
   - Template ID: 'thank_you_template' (use THANK_YOU_TEMPLATE HTML above)
   - Template ID: 'donation_receipt_template' (use DONATION_RECEIPT_TEMPLATE HTML above)
4. Get your Service ID and Public Key
5. Replace the placeholders in the components:
   - YOUR_SERVICE_ID
   - YOUR_PUBLIC_KEY
   - donation_template
   - project_inquiry_template
   - thank_you_template
   - donation_receipt_template

Template Variables to use in EmailJS:
Donation Template: {{donation_amount}}, {{from_name}}, {{from_email}}, {{message}}, {{billing_name}}, {{billing_address}}, {{discount_eligible}}
Project Inquiry Template: {{from_name}}, {{from_email}}, {{project_file}}
Thank You Template: {{name}}, {{project_file}}
Donation Receipt Template: {{donor_name}}, {{donation_amount}}, {{receipt_id}}, {{donation_date}}, {{donor_email}}, {{billing_address}}, {{last_four}}, {{discount_eligible}}, {{discount_code}}
`;