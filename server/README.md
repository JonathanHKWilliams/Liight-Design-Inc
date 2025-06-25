# Liight Design Email Server

This is the backend server for the LIIGHT DESIGN INC that handles email functionality using Nodemailer and Mailjet.

## Features

- Project inquiry form email handling
- Donation form email handling
- Email templates for admin notifications and user confirmations
- Secure credential management with dotenv

## Setup Instructions

### 1. Install Dependencies

Navigate to the server directory and install the required dependencies:

```bash
cd server
npm install
```

### 2. Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
ADMIN_EMAIL=liightdesigninc@gmail.com
```

Note: The Mailjet API credentials have been provided in the `.env.example` file.

### 3. Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Endpoints

### Project Inquiry Form

**Endpoint:** `/api/send-project-inquiry`
**Method:** POST
**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "organization": "Example Org",
  "projectDetails": "Project description here",
  "pdfUrl": "optional_pdf_preview_url"
}
```

### Donation Form

**Endpoint:** `/api/send-donation`
**Method:** POST
**Request Body:**
```json
{
  "amount": 100,
  "frequency": "one-time",
  "donorInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Optional message"
  },
  "billingInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA"
  },
  "cardInfo": {
    "cardNumber": "4242424242424242",
    "expiryDate": "12/25",
    "cvv": "123",
    "cardholderName": "John Doe"
  }
}
```

## Frontend Integration

The frontend components have been updated to use `fetch()` API calls to these endpoints instead of EmailJS. The forms now send data to the backend server, which handles email sending via Nodemailer and Mailjet.

## Security Notes

- Sensitive information like API keys are stored in the `.env` file which should never be committed to version control
- Card information is only used for testing and is not stored or processed for actual payments
- CORS is enabled to allow requests only from the frontend application
