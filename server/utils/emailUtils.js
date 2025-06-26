/**
 * Email utility functions for template filling and sending emails
 */
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/* ------------------------------------------------------------------ */
/* 1. SHARED TRANSPORTER (Mailjet SMTP)                               */
/* ------------------------------------------------------------------ */
export const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILJET_API_KEY,
    pass: process.env.MAILJET_SECRET_KEY
  },
  // Optional DKIM signing
  ...(process.env.DKIM_PRIVATE_KEY && {
    dkim: {
      domainName: process.env.DKIM_DOMAIN || 'liightdesign.com',
      keySelector: process.env.DKIM_KEY_SELECTOR || 'liight',
      privateKey: process.env.DKIM_PRIVATE_KEY
    }
  })
});

/* ------------------------------------------------------------------ */
/* 2. TEMPLATE FILLER                                                 */
/* ------------------------------------------------------------------ */
export const fillEmailTemplate = (template, data = {}) => {
  if (!template) throw new Error('Template string is required');

  return template.replace(/\${([^{}]*)}/g, (_, key) => {
    return data[key.trim()] ?? `\${${key}}`; // leave placeholder if no value
  });
};

/* ------------------------------------------------------------------ */
/* 3. SEND EMAIL WITH FILLED TEMPLATE                                 */
/* ------------------------------------------------------------------ */
/**
 * Sends an email using the shared transporter.
 * @param {Object}  options
 * @param {string}  options.to        - Recipient email
 * @param {string}  options.subject   - Subject line
 * @param {string}  options.template  - HTML template with ${placeholders}
 * @param {Object}  options.data      - Values for the placeholders
 * @param {string?} options.replyTo   - Optional reply-to address
 * @param {Array?}  options.attachments - Optional attachments array
 * @returns {Promise<Object>} Email info or error object with handled flag
 */
export const sendEmailWithTemplate = async (options) => {
  const { to, subject, template, data, replyTo, attachments } = options;

  if (!to || !subject || !template)
    throw new Error('to, subject, and template are required');

  const html = fillEmailTemplate(template, data);

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"LIIGHT DESIGN" <liightdesigninc@gmail.com>',
    to,
    subject,
    html,
    replyTo,
    attachments,
    headers: {
      'X-Priority': '1',
      'Importance': 'high'
    },
    messageId: `<${Date.now()}.${Math.random().toString(36).slice(2)}@liightdesign.com>`
  };

  try {
    // Calculate approximate message size before sending
    const estimatedSize = JSON.stringify(mailOptions).length;
    const attachmentSize = attachments ? attachments.reduce((size, attachment) => {
      // If attachment has a path, we can't accurately estimate its size here
      // If it has content as string or buffer, we can estimate
      if (attachment.content) {
        return size + (typeof attachment.content === 'string' 
          ? attachment.content.length 
          : attachment.content.length);
      }
      return size + 1024 * 1024; // Assume 1MB per file attachment as a safe estimate
    }, 0) : 0;
    
    const totalEstimatedSize = estimatedSize + attachmentSize;
    
    // Mailjet has a 15MB limit for emails (including attachments)
    const MAX_EMAIL_SIZE = 15 * 1024 * 1024; // 15MB in bytes
    
    if (totalEstimatedSize > MAX_EMAIL_SIZE) {
      console.warn(`Email size (${(totalEstimatedSize / (1024 * 1024)).toFixed(2)}MB) exceeds the 15MB limit. Attempting to send without attachments.`);
      
      // Try sending without attachments if they exist
      if (attachments && attachments.length > 0) {
        const linkText = attachments.map(a => a.filename || 'file').join(', ');
        
        // Modify the HTML to include a note about attachments being too large
        const modifiedHtml = html + `
          <div style="margin-top: 20px; padding: 10px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
            <p><strong>Note:</strong> The attachment(s) (${linkText}) could not be included in this email due to size limitations.</p>
            <p>Please access the file(s) through the provided link in this email or contact the sender for alternative access.</p>
          </div>
        `;
        
        // Send without attachments
        const modifiedOptions = { ...mailOptions, html: modifiedHtml, attachments: [] };
        const info = await transporter.sendMail(modifiedOptions);
        console.log(`Email sent without attachments: ${info.messageId}`);
        
        return {
          ...info,
          handled: true,
          warning: 'Email sent without attachments due to size limitations',
          originalAttachments: attachments.map(a => a.filename || 'unnamed-file')
        };
      }
    }
    
    // Normal send if size is acceptable or no attachments to remove
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    // Handle specific Nodemailer/Mailjet errors
    if (error.message && error.message.includes('message file too big')) {
      console.error('Error: Email message size too large');
      
      // Try sending without attachments as a fallback
      if (attachments && attachments.length > 0) {
        try {
          const linkText = attachments.map(a => a.filename || 'file').join(', ');
          
          // Modify the HTML to include a note about attachments being too large
          const modifiedHtml = html + `
            <div style="margin-top: 20px; padding: 10px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
              <p><strong>Note:</strong> The attachment(s) (${linkText}) could not be included in this email due to size limitations.</p>
              <p>Please access the file(s) through the provided link in this email or contact the sender for alternative access.</p>
            </div>
          `;
          
          // Send without attachments
          const modifiedOptions = { ...mailOptions, html: modifiedHtml, attachments: [] };
          const info = await transporter.sendMail(modifiedOptions);
          console.log(`Email sent without attachments: ${info.messageId}`);
          
          return {
            ...info,
            handled: true,
            warning: 'Email sent without attachments due to size limitations',
            originalAttachments: attachments.map(a => a.filename || 'unnamed-file')
          };
        } catch (fallbackError) {
          console.error('Fallback email also failed:', fallbackError.message);
          throw new Error(`Email size too large and fallback also failed: ${fallbackError.message}`);
        }
      } else {
        throw new Error(`Email size too large (${error.message}). Try reducing content or splitting into multiple emails.`);
      }
    } else {
      // Re-throw other errors
      console.error('Email sending error:', error.message);
      throw error;
    }
  }
};
