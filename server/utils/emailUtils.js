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

  const info = await transporter.sendMail(mailOptions);
  console.log(`✉️  Email sent: ${info.messageId}`);
  return info;
};
